"use client";
import { useContext } from "react";
import Topbar from "@/components/grubdash/Topbar";
import { Card, CardHeader, PageHeader, Pill, Stat } from "@/components/grubdash/Card";
import { PERSONAS } from "@/lib/personas";
import { usePersonaStore } from "@/lib/store";
import { OPS } from "@/lib/mock/operations";
import { AreaTrend } from "@/components/charts/Charts";
import Link from "next/link";
import MobileMenuContext from "./MobileMenuContext";

export default function Home() {
  const active = usePersonaStore((s) => s.activePersona);
  const persona = PERSONAS.find((p) => p.key === active) ?? PERSONAS[0];
  const ops = OPS[persona.key];
  const { open } = useContext(MobileMenuContext);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const trend = ops.weeklyTrend.map((y, i) => ({ x: days[i], y }));

  const capitalBlurb: Record<typeof persona.key, string> = {
    "no-offers": "No offers available yet. We'll notify you here if that changes.",
    "pre-approved": "You're pre-approved for capital. Accept in the Capital tab.",
    "capital-on-way": "Your funds are on the way — they'll hit your payout account soon.",
    "outstanding": "You have an active Parafin advance in good standing.",
  };

  return (
    <>
      <Topbar title="Home" onMenuClick={open} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        <PageHeader
          title={`Good afternoon, ${persona.displayName.split(" ")[0]}`}
          subtitle={`Here's how ${persona.dba} is trending today.`}
          action={
            <span className="text-[11px] text-ink-500 dark:text-slate-400">
              Last synced · just now
            </span>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <Stat
            label="Sales today"
            value={`$${ops.headline.salesToday.toLocaleString()}`}
            delta="+8.2%"
          />
          <Stat label="Orders" value={String(ops.headline.ordersToday)} delta="+4.1%" />
          <Stat
            label="Avg. ticket"
            value={`$${ops.headline.avgTicket.toFixed(2)}`}
            delta="+1.3%"
          />
          <Stat
            label="Customer rating"
            value={`${ops.headline.rating} ★`}
            delta={`+${Math.round(ops.headline.satRate / 10) / 10}%`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Sales · past 7 days"
              subtitle="Net of fees and refunds"
              action={<Pill tone="good">+6.4%</Pill>}
            />
            <div className="p-4 sm:p-5">
              <AreaTrend data={trend} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Capital" subtitle="Powered by Parafin" />
            <div className="p-5">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-brand-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12c4-6 14-6 18 0-4 6-14 6-18 0z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <p className="text-[13px] text-ink-700 dark:text-slate-300 leading-relaxed">
                {capitalBlurb[persona.key]}
              </p>
              <Link
                href="/dashboard/capital"
                className="inline-flex items-center gap-1 mt-4 text-[13px] font-medium text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                Open Capital
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
