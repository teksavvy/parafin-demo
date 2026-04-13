"use client";
import { useContext } from "react";
import Topbar from "@/components/grubdash/Topbar";
import { Card, CardHeader, PageHeader, Pill, Stat } from "@/components/grubdash/Card";
import { usePersonaStore } from "@/lib/store";
import { OPS } from "@/lib/mock/operations";
import { LineNet } from "@/components/charts/Charts";
import MobileMenuContext from "../MobileMenuContext";

export default function Page() {
  const active = usePersonaStore((s) => s.activePersona);
  const ops = OPS[active];
  const { open } = useContext(MobileMenuContext);
  const totalNet = ops.payouts.reduce((a, b) => a + b.net, 0);
  const totalFees = ops.payouts.reduce((a, b) => a + b.fees, 0);

  const chartData = [...ops.payouts]
    .reverse()
    .map((p) => ({ date: p.date, net: p.net, gross: p.gross }));

  return (
    <>
      <Topbar title="Payouts" onMenuClick={open} />
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
        <PageHeader title="Payouts" subtitle="Settlements to your linked bank account" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <Stat label="Net paid (7d)" value={`$${totalNet.toLocaleString()}`} delta="+5.1%" />
          <Stat label="Fees (7d)" value={`$${totalFees.toLocaleString()}`} delta="+5.1%" />
          <Stat label="Next payout" value="Tomorrow" />
          <Stat label="Payout method" value="ACH · …4821" />
        </div>

        <Card className="mb-4">
          <CardHeader title="Payout history" subtitle="Net vs gross over the period" />
          <div className="p-4 sm:p-5">
            <LineNet data={chartData} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent payouts"
            subtitle="Settled to your bank account ending in 4821"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] min-w-[640px]">
              <thead>
                <tr className="text-ink-500 dark:text-slate-400 text-[11px] uppercase tracking-wider border-b border-ink-200 dark:border-slate-700">
                  <th className="text-left px-5 py-3 font-medium">ID</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-right px-5 py-3 font-medium">Gross</th>
                  <th className="text-right px-5 py-3 font-medium">Fees</th>
                  <th className="text-right px-5 py-3 font-medium">Net</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ops.payouts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-ink-100 dark:border-slate-800 hover:bg-ink-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="px-5 py-3.5 font-medium tabular text-ink-900 dark:text-slate-100">
                      {p.id}
                    </td>
                    <td className="px-5 py-3.5 text-ink-500 dark:text-slate-400">{p.date}</td>
                    <td className="px-5 py-3.5 text-right tabular text-ink-700 dark:text-slate-200">
                      ${p.gross.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right text-ink-500 dark:text-slate-400 tabular">
                      −${p.fees.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular text-ink-900 dark:text-slate-100">
                      ${p.net.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill tone={p.status === "Paid" ? "good" : "info"}>{p.status}</Pill>
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
