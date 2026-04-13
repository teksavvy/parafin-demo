"use client";
import { PERSONAS } from "@/lib/personas";
import { usePersonaStore } from "@/lib/store";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Topbar({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}) {
  const active = usePersonaStore((s) => s.activePersona);
  const persona = PERSONAS.find((p) => p.key === active) ?? PERSONAS[0];
  return (
    <div className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-ink-200 dark:border-slate-800 flex items-center px-4 sm:px-6 lg:px-8 gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 rounded-lg hover:bg-ink-100 dark:hover:bg-slate-800 flex items-center justify-center text-ink-600 dark:text-slate-300"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-[16px] sm:text-[18px] font-semibold tracking-tight text-ink-900 dark:text-slate-50 truncate">
          {title}
        </h1>
        <p className="text-[12px] text-ink-500 dark:text-slate-400 mt-0.5 truncate">
          {subtitle ?? `${persona.dba} · ${persona.city}`}
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
}
