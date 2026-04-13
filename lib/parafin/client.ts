const BASE = "https://api.parafin.com";

function authHeader(): string {
  const id = process.env.PARAFIN_CLIENT_ID;
  const secret = process.env.PARAFIN_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("Missing PARAFIN_CLIENT_ID / PARAFIN_CLIENT_SECRET in .env.local");
  }
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export interface ParafinFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

export async function parafinFetch<T = unknown>(
  path: string,
  opts: ParafinFetchOptions = {}
): Promise<T> {
  const url = new URL(path.startsWith("http") ? path : BASE + path);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), {
    method: opts.method ?? "GET",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data as any).message) || res.statusText;
    throw new Error(`Parafin ${opts.method ?? "GET"} ${path} → ${res.status}: ${msg}`);
  }
  return data as T;
}
