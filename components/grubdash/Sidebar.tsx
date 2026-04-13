"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/orders", label: "Orders", icon: OrdersIcon },
  { href: "/dashboard/menu", label: "Menu", icon: MenuIcon },
  { href: "/dashboard/analytics", label: "Insights", icon: InsightsIcon },
  { href: "/dashboard/payouts", label: "Payouts", icon: PayoutsIcon },
  { href: "/dashboard/capital", label: "Capital", icon: CapitalIcon, highlight: true },
];

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const path = usePathname();
  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-ink-900/40 z-40 md:hidden backdrop-blur-sm"
        />
      )}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-ink-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-grub-red to-grub-redDark text-white text-[15px] font-bold shadow-card">
              G
            </span>
            <div className="leading-tight">
              <span className="block font-semibold text-[14px] tracking-tight text-ink-900 dark:text-slate-50">
                GrubDash
              </span>
              <span className="block text-[10px] text-ink-500 dark:text-slate-400 font-medium">
                Merchant Portal
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 rounded-lg hover:bg-ink-100 dark:hover:bg-slate-800 flex items-center justify-center text-ink-500 dark:text-slate-400"
            aria-label="Close menu"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="px-3 flex-1">
          {ITEMS.map((item) => {
            const active =
              item.href === "/dashboard"
                ? path === "/dashboard"
                : path.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2 my-0.5 text-[13px] rounded-lg transition ${
                  active
                    ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 font-medium"
                    : "text-ink-600 dark:text-slate-400 hover:bg-ink-100 dark:hover:bg-slate-800 hover:text-ink-900 dark:hover:text-slate-100"
                }`}
              >
                <Icon active={active} />
                <span className="flex-1">{item.label}</span>
                {item.highlight && (
                  <span className="text-[9px] bg-brand-500 text-white px-1.5 py-0.5 rounded-md font-semibold tracking-wider uppercase">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-ink-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[10px] text-ink-500 dark:text-slate-500 font-medium uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse" />
            Sandbox · Parafin
          </div>
        </div>
      </aside>
    </>
  );
}

function iconCls(active: boolean) {
  return `w-[18px] h-[18px] ${active ? "text-brand-500" : "text-ink-400 dark:text-slate-500"}`;
}
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className={iconCls(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" strokeLinejoin="round" />
    </svg>
  );
}
function OrdersIcon({ active }: { active: boolean }) {
  return (
    <svg className={iconCls(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3h9l4 4v14H6z" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h6" strokeLinecap="round" />
    </svg>
  );
}
function MenuIcon({ active }: { active: boolean }) {
  return (
    <svg className={iconCls(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" />
    </svg>
  );
}
function InsightsIcon({ active }: { active: boolean }) {
  return (
    <svg className={iconCls(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" strokeLinecap="round" />
    </svg>
  );
}
function PayoutsIcon({ active }: { active: boolean }) {
  return (
    <svg className={iconCls(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function CapitalIcon({ active }: { active: boolean }) {
  return (
    <svg className={iconCls(active)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12c4-6 14-6 18 0-4 6-14 6-18 0z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
