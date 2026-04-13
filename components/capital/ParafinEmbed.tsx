"use client";
import { useEffect, useState } from "react";

export default function ParafinEmbed({ personaKey }: { personaKey: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    setUrl(null);
    fetch(`/api/parafin/dashboard-link?persona=${personaKey}`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.ok) setUrl(d.url);
        else setErr(d.message || "Failed to create dashboard link");
      })
      .catch((e) => !cancelled && setErr(String(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [personaKey]);

  return (
    <div className="bg-white dark:bg-slate-850 border border-ink-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-card">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-ink-200 dark:border-slate-700 bg-brand-50 dark:bg-brand-500/5">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-[13px] font-semibold text-ink-900 dark:text-slate-100">
            Parafin Embedded Dashboard
          </span>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-medium text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
          >
            Open in new tab ↗
          </a>
        )}
      </div>
      <div className="relative h-[620px] sm:h-[720px] bg-white">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-[13px] text-ink-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              Generating secure Parafin session…
            </span>
          </div>
        )}
        {err && (
          <div className="absolute inset-0 flex items-center justify-center text-[13px] text-grub-red px-8 text-center">
            Could not load Parafin dashboard: {err}
          </div>
        )}
        {url && (
          <iframe
            src={url}
            className="w-full h-full border-0"
            allow="clipboard-read; clipboard-write"
          />
        )}
      </div>
    </div>
  );
}
