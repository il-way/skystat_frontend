import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import { ChartAutoSizer } from "@/components/chart/ChartAutoSizer";
import Hint from "@/components/common/Hint";
import { ThresholdKpiCardGrid } from "@/components/kpi/ThresholdKpiGrid";
import Topbar from "@/components/topbar/Topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { groupHourly, groupMonthly, groupYearly } from "@/lib/temperature";
import { localInputToISO, monthShortNames, toLocalInput } from "@/lib/date";
import { getYeras } from "@/lib/temperature";
import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import type { TemperatureStatisticQueryParams } from "@/types/api/request/statistic/TemperatureStatisticQueryParams";
import type { TemperaturedKpiValues, ThresholdKpiValues } from "@/types/components/kpi/ThresholdKpiValues";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TemperatureKpiGrid } from "@/components/kpi/TemperatureKpiGrid";

const TEMP_COLORS = {
  maxAvg: "#ef4444", // red   — mean T_max
  mean:   "#22c55e", // green — mean T
  minAvg: "#60a5fa", // blue  — mean T_min
} as const;

export default function Temperature() {
  const [icao, setIcao] = useState("KJFK");
  const [from, setFrom] = useState("2019");
  const [to, setTo] = useState("2023");
  
  const [loading, setLoading] = useState(false);

  const queryParams: TemperatureStatisticQueryParams = useMemo(
    () => ({
      icao,
      startYear: from,
      endYear: to,
    }),
    [icao, from, to]
  );

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["temperature-stats", queryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchTemperatureStatistic({
        icao,
        startYear: from,
        endYear: to,
      }),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  async function handleFetch() {
    setLoading(true);
    try {
      await refetch();
    } finally {
      setLoading(false);
    }
  }

  // const kpis: ThresholdKpiValues = useMemo(
  //   () => ({
  //     sampleSize: data?.totalCount ?? 0,
  //     totalDaysCount: monthAgg.totalDaysCount ?? 0,
  //     mostFrequentMonth: monthAgg.mostFrequentMonth ?? "JAN",
  //     mostFrequentHour:
  //       hourAgg.mostFrequentHour(monthAgg.mostFrequentMonth) ?? "00",
  //   }),
  //   [data, monthAgg, hourAgg]
  // );
  const yearAgg = groupYearly(data);
  const monthAgg = groupMonthly(data);
  const hourAgg = groupHourly(data);

  const [yearSel, setYearSel] = useState<"total" | number>("total");
  const [monthSel, setMonthSel] = useState<number>(1);
  const [mtView, setMtView] = useState<"graph" | "table">("graph");
  const [hrView, setHrView] = useState<"graph" | "table">("graph");

  const monthSeries = yearSel === "total"
      ? monthAgg.totalSeries
      : monthAgg.seriesOf(yearSel as number);

  const monthTable = yearSel === "total"
      ? monthAgg.totalTable
      : monthAgg.tableOf(yearSel as number);

  const hourSeries = yearSel === "total"
      ? hourAgg.totalSeriesOf(monthSel)
      : hourAgg.seriesOf(Number(yearSel), monthSel);

  const hourTable = yearSel === "total"
      ? hourAgg.totalTableOf(monthSel)
      : hourAgg.tableOf(Number(yearSel), monthSel);

  const kpis: TemperaturedKpiValues = {
    years: yearAgg.years,
    sampleSize: data?.totalCount ?? 0,
    annualMean: yearAgg.annualMean,
    annualMax: yearAgg.annualMax,
    annualMin: yearAgg.annualMin,
  };

  return (
    <>
      <Topbar
        icao={icao}
        setIcao={setIcao}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        loading={loading}
        isFetching={isFetching}
        onFetch={handleFetch}
        inputType="number"
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Analytics</span>
            <span>/</span>
            <span className="text-foreground">Temperature</span>
            <Hint text="[℃]"/>
          </div>
          <Badge variant="secondary">Summary</Badge>
        </div>

        <TemperatureKpiGrid kpis={kpis} />

        {/* ==== (1) 월별 관측일수: 연도별 or 합계 그래프/테이블 ==== */}
        <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
          <CardHeader className="pb-2 space-y-2">
            <CardTitle className="text-base">
              Number of observed days (monthly)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={String(yearSel)}
                onValueChange={(v) =>
                  setYearSel(v === "total" ? "total" : Number(v))
                }
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue placeholder="year" />
                </SelectTrigger>
                <SelectContent>
                  {monthAgg.years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                  <SelectItem value="total">total</SelectItem>
                </SelectContent>
              </Select>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  variant={mtView === "graph" ? "default" : "secondary"}
                  onClick={() => setMtView("graph")}
                >
                  Graph
                </Button>
                <Button
                  size="sm"
                  variant={mtView === "table" ? "default" : "secondary"}
                  onClick={() => setMtView("table")}
                >
                  Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent
            className={`w-full min-w-0 ${mtView === "graph" ? "h-80" : ""}`}
          >
            {mtView === "graph" ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthSeries} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthShortName" />
                  <YAxis unit="°C" allowDecimals />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="dailyMaxAvg" name="mean T_max" 
                    stroke={TEMP_COLORS.maxAvg}
                    strokeWidth={2}
                    dot={{ r: 3, stroke: TEMP_COLORS.maxAvg, fill: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 4, stroke: TEMP_COLORS.maxAvg, fill: TEMP_COLORS.maxAvg }} />
                  <Line type="monotone" dataKey="dailyMeanAvg" name="mean T" 
                    stroke={TEMP_COLORS.mean}
                    strokeWidth={2}
                    dot={{ r: 3, stroke: TEMP_COLORS.mean, fill: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 4, stroke: TEMP_COLORS.mean, fill: TEMP_COLORS.mean }}
                  />
                  <Line type="monotone" dataKey="dailyMinAvg" name="mean T_min" 
                    stroke={TEMP_COLORS.minAvg}
                    strokeWidth={2}
                    dot={{ r: 3, stroke: TEMP_COLORS.minAvg, fill: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 4, stroke: TEMP_COLORS.minAvg, fill: TEMP_COLORS.minAvg }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
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

                  <thead className="text-left text-muted-foreground border-b">
                    <tr>
                      <th className="py-2 pr-4">Month</th>
                      <th className="py-2 pr-4">T</th>
                      <th className="py-2 pr-4">T̄_max</th>
                      <th className="py-2 pr-4">T̄_min</th>
                      <th className="py-2 pr-4">T_max</th>
                      <th className="py-2 pr-4">T_min</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthTable.map((r) => (
                      <tr key={r.month} className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors">
                        <td className="py-2 pl-2 pr-4">{r.monthShotrName}</td>
                        <td className="py-2 pl-2 pr-4">{r.mean}</td>
                        <td className="py-2 pl-2 pr-4">{r.meanMax}</td>
                        <td className="py-2 pl-2 pr-4">{r.meanMin}</td>
                        <td className="py-2 pl-2 pr-4">{r.monthlyMax}</td>
                        <td className="py-2 pl-2 pr-4">{r.monthlyMin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ==== (2) 시간별 관측횟수: 연/월 선택 그래프/테이블 + 합계 지원 ==== */}
        <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
          <CardHeader className="pb-2 space-y-2">
            <CardTitle className="text-base">
              Number of observed days (hourly)
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={String(yearSel)}
                onValueChange={(v) =>
                  setYearSel(v === "total" ? "total" : Number(v))
                }
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue placeholder="year" />
                </SelectTrigger>
                <SelectContent>
                  {hourAgg.years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                  <SelectItem value="total">total</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={String(monthSel)}
                onValueChange={(v) => setMonthSel(Number(v))}
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue placeholder="month" />
                </SelectTrigger>
                <SelectContent>
                  {monthShortNames.map((m, i) => (
                    <SelectItem key={m} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="ml-auto flex gap-2">
                <Button
                  size="sm"
                  variant={hrView === "graph" ? "default" : "secondary"}
                  onClick={() => setHrView("graph")}
                >
                  Graph
                </Button>
                <Button
                  size="sm"
                  variant={hrView === "table" ? "default" : "secondary"}
                  onClick={() => setHrView("table")}
                >
                  Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent
            className={`w-full min-w-0 ${hrView === "graph" ? "h-80" : ""}`}
          >
            {hrView === "graph" ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourSeries} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis unit="°C" allowDecimals />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mean" name="mean T" dot />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <colgroup>
                    <col className="w-1/4" />
                    <col className="w-1/4" />
                    <col className="w-1/4" />
                    <col className="w-1/4" />
                  </colgroup>
                  <thead className="text-left text-muted-foreground border-b">
                    <tr>
                      <th className="py-2 pl-2 pr-4">Hour</th>
                      <th className="py-2 pl-2 pr-4">T</th>
                      <th className="py-2 pl-2 pr-4">T_max</th>
                      <th className="py-2 pl-2 pr-4">T_min</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourTable.map((r) => (
                      <tr key={r.hour} className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors">
                        <td className="py-2 pl-2 pr-4">{r.hour}Z</td>
                        <td className="py-2 pl-2 pr-4">{r.mean}</td>
                        <td className="py-2 pl-2 pr-4">{r.max}</td>
                        <td className="py-2 pl-2 pr-4">{r.min}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
  
        <Separator />
        {/* Next steps */}
        <div className="text-sm text-muted-foreground leading-6">
          <div className="font-medium text-foreground mb-1">
            Next steps (실전 적용 가이드)
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              여기가 있어야 가로폭이 유지됨. 글자수 따라 보이는 가로폭이 달라짐 최소폭으로 했을 때 2줄로 보이도록 글을 좀 써야됨
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
