import type { MetarRow } from "@/types/metar/MetarRow";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { JSX } from "react";

export default function ResultsTable({ rows }: { rows: MetarRow[] }): JSX.Element {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4">Month</th>
                <th className="py-2 pr-4">WindPeak</th>
                <th className="py-2 pr-4">Vis (m)</th>
                <th className="py-2 pr-4">Ceiling (ft)</th>
                <th className="py-2 pr-4">ThunderStorm (TS)</th>
                <th className="py-2 pr-4">Snow (SN)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-none">
                  <td className="py-2 pr-4 whitespace-nowrap">{new Date(r.time).toISOString().replace(".000Z", "Z")}</td>
                  <td className="py-2 pr-4">{r.station}</td>
                  <td className="py-2 pr-4">{r.windDir}° / {r.windSpdKt} kt</td>
                  <td className="py-2 pr-4">{r.vis}</td>
                  <td className="py-2 pr-4">{r.ceiling ?? "-"}</td>
                  <td className="py-2 pr-4">{r.weather}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}