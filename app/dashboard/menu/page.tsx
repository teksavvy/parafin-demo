"use client";
import { useContext } from "react";
import Topbar from "@/components/grubdash/Topbar";
import { Card, CardHeader, PageHeader, Pill } from "@/components/grubdash/Card";
import { usePersonaStore } from "@/lib/store";
import { OPS } from "@/lib/mock/operations";
import MobileMenuContext from "../MobileMenuContext";

export default function Page() {
  const active = usePersonaStore((s) => s.activePersona);
  const ops = OPS[active];
  const { open } = useContext(MobileMenuContext);
  const byCat = ops.menu.reduce<Record<string, typeof ops.menu>>((acc, m) => {
    (acc[m.category] ??= []).push(m);
    return acc;
  }, {});
  return (
    <>
      <Topbar title="Menu" onMenuClick={open} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        <PageHeader
          title="Menu"
          subtitle={`${ops.menu.length} items · ${ops.menu.filter((m) => m.available).length} available`}
          action={
            <button className="text-[12px] px-3 py-2 rounded-lg bg-ink-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium hover:bg-ink-700 dark:hover:bg-white transition">
              + Add item
            </button>
          }
        />

        <div className="space-y-4">
          {Object.entries(byCat).map(([cat, items]) => (
            <Card key={cat}>
              <CardHeader title={cat} subtitle={`${items.length} item${items.length === 1 ? "" : "s"}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 sm:p-5">
                {items.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between border border-ink-200 dark:border-slate-700 bg-ink-50/50 dark:bg-slate-900/50 rounded-xl p-3 hover:border-ink-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-ink-100 to-ink-200 dark:from-slate-700 dark:to-slate-800 shrink-0 flex items-center justify-center text-ink-400 dark:text-slate-500 text-[11px] font-medium">
                        {m.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-ink-900 dark:text-slate-100 truncate">
                          {m.name}
                        </p>
                        <p className="text-[11px] text-ink-500 dark:text-slate-400 tabular">
                          {m.orders30d.toLocaleString()} orders · 30d
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-[13px] font-semibold tabular text-ink-900 dark:text-slate-100">
                        ${m.price.toFixed(2)}
                      </p>
                      <Pill tone={m.available ? "good" : "neutral"}>
                        {m.available ? "Available" : "Paused"}
                      </Pill>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
