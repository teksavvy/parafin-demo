export default function StateHero({
  eyebrow,
  title,
  subtitle,
  tone = "info",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  tone?: "info" | "good" | "neutral" | "bad";
}) {
  const bg: Record<string, string> = {
    info: "linear-gradient(135deg,#635BFF 0%,#0A2540 100%)",
    good: "linear-gradient(135deg,#10B981 0%,#064C2E 100%)",
    neutral: "linear-gradient(135deg,#425466 0%,#0A2540 100%)",
    bad: "linear-gradient(135deg,#EB1700 0%,#6E0C00 100%)",
  };
  return (
    <div
      className="relative rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-pop"
      style={{ background: bg[tone] }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 50%)",
        }}
      />
      <div className="relative">
        <p className="text-[11px] uppercase tracking-widest opacity-80 font-medium">{eyebrow}</p>
        <h2 className="text-[22px] sm:text-[28px] font-semibold mt-2 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-[13px] opacity-90 mt-3 max-w-xl leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}
