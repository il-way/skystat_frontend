import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useMemo, type JSX } from "react";
import Hint from "../../../components/common/Hint";
import type { DashboardTableRow } from "@/pages/dashboard/types/DashboardTable";
import { monthShortNameFrom } from "@/lib/date";
import { ResponsiveContainer } from "recharts";

export default function DashboardTable({ rows }: { rows: DashboardTableRow[] }): JSX.Element {
  const nf = useMemo(() => new Intl.NumberFormat("en-US"), []);

  return (
    <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Observed Days</CardTitle>
        <CardDescription>For each calendar month, this table counts the number of days that satisfy the condition.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-w-[80vw] sm:max-w-full">
          <table className="w-full text-sm">
            <colgroup>
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
            </colgroup>

            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right">Month</th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right">
                  <div>WindPeak</div>
                  <Hint text="&ge;30kt"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right">
                  <div>Visbility</div>
                  <Hint text="&le;800m"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right">
                  <div>Ceiling</div>
                  <Hint text="&le;200ft"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right">
                  <div className="hidden sm:block">Thunderstorm</div>
                  <div className="sm:hidden">TS</div>
                  <Hint text="(TS)"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right">
                  <div className="hidden sm:block">Snow</div>
                  <div className="sm:hidden">SN</div>
                  <Hint text="(SN)"/>
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((row, idx) => (
                <tr key={`dashboard-table-${idx}`} className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors">
                  <td className="pl-4 pr-6 md:pr-8 py-2 text-right whitespace-nowrap">{monthShortNameFrom(row.month)}</td>
                  <td className="pl-4 pr-6 md:pr-8 py-2 text-right">{nf.format(row.windPeak)}</td>
                  <td className="pl-4 pr-6 md:pr-8 py-2 text-right">{nf.format(row.visibility)}</td>
                  <td className="pl-4 pr-6 md:pr-8 py-2 text-right">{nf.format(row.ceiling)}</td>
                  <td className="pl-4 pr-6 md:pr-8 py-2 text-right">{nf.format(row.thunderStorm)}</td>
                  <td className="pl-4 pr-6 md:pr-8 py-2 text-right">{nf.format(row.snow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}