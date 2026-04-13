export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-850 border border-ink-200 dark:border-slate-700 rounded-2xl shadow-card ${
        interactive ? "hover:shadow-cardHover hover:border-ink-300 dark:hover:border-slate-600 transition-all" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200 dark:border-slate-700">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-ink-900 dark:text-slate-100 truncate">{title}</p>
        {subtitle && <p className="text-[11px] text-ink-500 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  deltaTone,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "good" | "bad" | "neutral";
  icon?: React.ReactNode;
}) {
  const up = delta?.startsWith("+");
  const tone = deltaTone ?? (up ? "good" : delta ? "bad" : "neutral");
  const deltaCls =
    tone === "good"
      ? "text-good bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
      : tone === "bad"
      ? "text-grub-red bg-red-50 dark:bg-red-950/40 dark:text-red-400"
      : "text-ink-500 dark:text-slate-400 bg-ink-100 dark:bg-slate-800";
  return (
    <Card className="p-5 group" interactive>
      <div className="flex items-start justify-between">
        <p className="text-[11px] text-ink-500 dark:text-slate-400 uppercase tracking-wider font-medium">
          {label}
        </p>
        {icon && <span className="text-ink-400 dark:text-slate-500">{icon}</span>}
      </div>
      <p className="text-[24px] font-semibold tabular mt-2 text-ink-900 dark:text-slate-50 tracking-tight">
        {value}
      </p>
      {delta && (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md mt-2 tabular ${deltaCls}`}
        >
          {up ? "↑" : tone === "bad" ? "↓" : ""} {delta}
        </span>
      )}
    </Card>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "info" | "bad" | "brand";
}) {
  const map: Record<string, string> = {
    neutral: "bg-ink-100 text-ink-600 dark:bg-slate-800 dark:text-slate-300",
    good: "bg-emerald-50 text-good dark:bg-emerald-950/40 dark:text-emerald-400",
    warn: "bg-amber-50 text-warn dark:bg-amber-950/40 dark:text-amber-400",
    info: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
    bad: "bg-red-50 text-grub-redDark dark:bg-red-950/40 dark:text-red-400",
    brand: "bg-brand-500 text-white",
  };
  return (
    <span
      className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function Sparkline({ values, color = "#635BFF" }: { values: number[]; color?: string }) {
  if (values.length === 0) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 120;
  const h = 32;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const pts = values
    .map((v, i) => {
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i * step},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-[24px] sm:text-[28px] font-semibold tracking-tight text-ink-900 dark:text-slate-50">
          {title}
        </h2>
        {subtitle && (
          <p className="text-ink-500 dark:text-slate-400 mt-1 text-[13px]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
