import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useMemo, type JSX } from "react";
import Hint from "../../../components/common/Hint";
import type { DashboardTableRow } from "@/pages/dashboard/types/DashboardTable";
import { monthShortNameFrom } from "@/lib/date";
import { useTranslation } from "react-i18next";

export default function DashboardTable({ rows }: { rows: DashboardTableRow[] }): JSX.Element {
  const nf = useMemo(() => new Intl.NumberFormat("en-US"), []);
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl w-full min-w-0 overflow-hidden border-slate-200 bg-white/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-slate-900">{t("dashboard.table.title")}</CardTitle>
        <CardDescription className="text-slate-500">
          {t("dashboard.table.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-w-[80vw] sm:max-w-full">
          <table className="w-full text-sm text-slate-700">
            <colgroup>
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
            </colgroup>

            <thead className="bg-slate-50 text-left text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right font-semibold">{t("reportPage.monthly.headers.month")}</th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right font-semibold">
                  <div>{t("reportPage.monthly.headers.windPeak")}</div>
                  <Hint text="&ge;30kt"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right font-semibold">
                  <div>{t("reportPage.monthly.headers.visibility")}</div>
                  <Hint text="&le;800m"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right font-semibold">
                  <div>{t("reportPage.monthly.headers.ceiling")}</div>
                  <Hint text="&le;200ft"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right font-semibold">
                  <div className="hidden sm:block">{t("reportPage.monthly.headers.thunderstorm")}</div>
                  <div className="sm:hidden">TS</div>
                  <Hint text="(TS)"/>
                </th>
                <th className="pl-4 pr-6 md:pr-8 py-2 text-right font-semibold">
                  <div className="hidden sm:block">{t("reportPage.monthly.headers.snow")}</div>
                  <div className="sm:hidden">SN</div>
                  <Hint text="(SN)"/>
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums divide-y divide-slate-100/80">
              {rows.map((row, idx) => (
                <tr
                  key={`dashboard-table-${idx}`}
                  className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
                >
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
