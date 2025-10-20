import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { JSX } from "react";
import Hint from "../commin/Hint";
import type { DashboardTableRow } from "@/types/components/dashboard/DashboardTable";
import { monthShortNameFrom } from "@/lib/date";

export default function DashboardTable({ icao, from, to, rows }: { icao: string, from: string, to: string, rows: DashboardTableRow[] }): JSX.Element {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Count Results</CardTitle>
        <CardDescription>For each calendar month, this table counts the number of days that satisfy the condition.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
                <th className="py-2 pr-4">Month</th>
                <th className="py-2 pr-4">
                  <div>WindPeak</div>
                  <Hint text="&ge;30kt"/>
                </th>
                <th className="py-2 pr-4">
                  <div>Visbility</div>
                  <Hint text="&le;800m"/>
                </th>
                <th className="py-2 pr-4">
                  <div>Ceiling</div>
                  <Hint text="&le;200ft"/>
                </th>
                <th className="py-2 pr-4">
                  <div>Thunderstorm</div>
                  <Hint text="(TS)"/>
                </th>
                <th className="py-2 pr-4">
                  <div>Snow</div>
                  <Hint text="(SN)"/>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={`dashboard-table-${idx}`} className="border-b last:border-none">
                  <td className="py-2 pr-4 whitespace-nowrap">{monthShortNameFrom(row.month)}</td>
                  <td className="py-2 pr-4">{row.windPeak}</td>
                  <td className="py-2 pr-4">{row.visibility}</td>
                  <td className="py-2 pr-4">{row.ceiling}</td>
                  <td className="py-2 pr-4">{row.thunderStorm}</td>
                  <td className="py-2 pr-4">{row.snow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}