"use client";
import { useContext } from "react";
import Topbar from "@/components/grubdash/Topbar";
import { Card, CardHeader, PageHeader, Stat } from "@/components/grubdash/Card";
import { usePersonaStore } from "@/lib/store";
import { OPS } from "@/lib/mock/operations";
import { BarHours, CategoryDonut, HorizontalBars } from "@/components/charts/Charts";
import MobileMenuContext from "../MobileMenuContext";

export default function Page() {
  const active = usePersonaStore((s) => s.activePersona);
  const ops = OPS[active];
  const { open } = useContext(MobileMenuContext);

  const categoryData = Object.entries(
    ops.menu.reduce<Record<string, number>>((acc, m) => {
      acc[m.category] = (acc[m.category] ?? 0) + m.orders30d * m.price;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value: Math.round(value) }));

  const topItemsBars = ops.topItems.map((t) => ({ name: t.name, value: t.revenue }));

  return (
    <>
      <Topbar title="Insights" onMenuClick={open} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        <PageHeader title="Insights" subtitle="Sales performance and customer trends" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <Stat
            label="Net sales (7d)"
            value={`$${ops.weeklyTrend.reduce((a, b) => a + b, 0).toLocaleString()}`}
            delta="+6.4%"
          />
          <Stat label="Orders (7d)" value={String(ops.headline.ordersToday * 7)} delta="+3.1%" />
          <Stat label="Satisfaction" value={`${ops.headline.satRate}%`} delta="+0.8%" />
          <Stat label="Avg. prep time" value="11m 40s" delta="-1.2%" deltaTone="good" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Sales by hour" subtitle="Average weekday" />
            <div className="p-4 sm:p-5">
              <BarHours data={ops.salesByDaypart} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Revenue by category" subtitle="Last 30 days" />
            <div className="p-4 sm:p-5">
              <CategoryDonut data={categoryData} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Top items · revenue" subtitle="Last 30 days" />
            <div className="p-4 sm:p-5">
              <HorizontalBars data={topItemsBars} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Top items · orders" subtitle="Last 30 days" />
            <ul className="p-2">
              {ops.topItems.map((t, i) => (
                <li
                  key={t.name}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-ink-50 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 text-[11px] font-semibold flex items-center justify-center tabular shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink-900 dark:text-slate-100 truncate">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-ink-500 dark:text-slate-400 tabular">
                        {t.count.toLocaleString()} orders
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold tabular text-ink-900 dark:text-slate-100 shrink-0 ml-2">
                    ${t.revenue.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
