"use client";
import { useContext, useState } from "react";
import Topbar from "@/components/grubdash/Topbar";
import { Card, CardHeader, PageHeader, Pill } from "@/components/grubdash/Card";
import { usePersonaStore } from "@/lib/store";
import { OPS } from "@/lib/mock/operations";
import MobileMenuContext from "../MobileMenuContext";

const FILTERS = ["All", "New", "Preparing", "Out for delivery", "Delivered"] as const;

export default function Page() {
  const active = usePersonaStore((s) => s.activePersona);
  const ops = OPS[active];
  const { open } = useContext(MobileMenuContext);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = filter === "All" ? ops.orders : ops.orders.filter((o) => o.status === filter);

  return (
    <>
      <Topbar title="Orders" onMenuClick={open} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        <PageHeader
          title="Orders"
          subtitle={`${ops.orders.length} orders in progress today`}
        />

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1">
          {FILTERS.map((t) => {
            const isActive = filter === t;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap transition ${
                  isActive
                    ? "bg-ink-900 text-white border-ink-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                    : "bg-white dark:bg-slate-850 border-ink-200 dark:border-slate-700 text-ink-600 dark:text-slate-300 hover:text-ink-900 dark:hover:text-slate-50 hover:border-ink-300 dark:hover:border-slate-600"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <Card>
          <CardHeader title="Today's orders" subtitle={`${filtered.length} shown`} />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] min-w-[720px]">
              <thead>
                <tr className="text-ink-500 dark:text-slate-400 text-[11px] uppercase tracking-wider border-b border-ink-200 dark:border-slate-700">
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Time</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Items</th>
                  <th className="text-left px-5 py-3 font-medium">Driver</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-ink-100 dark:border-slate-800 hover:bg-ink-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="px-5 py-3.5 font-medium tabular text-ink-900 dark:text-slate-100">
                      {o.id}
                    </td>
                    <td className="px-5 py-3.5 text-ink-500 dark:text-slate-400 tabular">
                      {o.time}
                    </td>
                    <td className="px-5 py-3.5 text-ink-700 dark:text-slate-200">{o.customer}</td>
                    <td className="px-5 py-3.5 text-ink-500 dark:text-slate-400 tabular">
                      {o.items}
                    </td>
                    <td className="px-5 py-3.5 text-ink-500 dark:text-slate-400">
                      {o.driver ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill
                        tone={
                          o.status === "Delivered"
                            ? "good"
                            : o.status === "Out for delivery"
                            ? "info"
                            : o.status === "New"
                            ? "warn"
                            : "neutral"
                        }
                      >
                        {o.status}
                      </Pill>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium tabular text-ink-900 dark:text-slate-100">
                      ${o.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
