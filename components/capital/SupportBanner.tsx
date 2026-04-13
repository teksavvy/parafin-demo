export default function SupportBanner() {
  return (
    <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-2xl px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-slate-850 border border-brand-200 dark:border-brand-500/30 text-brand-500 shrink-0">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6h16v12H4z" strokeLinejoin="round" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-ink-900 dark:text-slate-100">
            Questions about your capital offer?
          </p>
          <p className="text-[12px] text-ink-500 dark:text-slate-400">
            Reach a Parafin capital specialist — usually responds within one business day.
          </p>
        </div>
      </div>
      <a
        href="mailto:support@parafin.com"
        className="text-[12px] font-semibold text-white bg-brand-500 hover:bg-brand-600 transition px-4 py-2 rounded-lg whitespace-nowrap text-center"
      >
        support@parafin.com
      </a>
    </div>
  );
}
