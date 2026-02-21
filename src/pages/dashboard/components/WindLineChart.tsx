import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { JSX } from "react";
import type { WindLineProps } from "../types/WindLineProps";
import { useTranslation } from "react-i18next";

export default function WindLineChart(props: WindLineProps): JSX.Element {
  const { data } = props;
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl border-slate-200 bg-white/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base text-slate-900">{t("dashboard.chart.title")}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip formatter={(value: number) => [`${value} kt`, t("dashboard.kpi.avgWind")]} />
            <Line type="monotone" dataKey="wind" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
