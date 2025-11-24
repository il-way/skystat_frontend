import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import Topbar from "@/components/topbar/Topbar";
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
import { monthShortNames } from "@/lib/date";
import type { TemperatureStatisticQueryParams } from "@/api/types/request/statistic/TemperatureStatisticQueryParams";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TemperatureKpiGrid } from "@/pages/temperature/components/TemperatureKpiGrid";
import { groupHourly, groupMonthly, groupYearly } from "./TemperatureHelper";
import type { TemperaturedKpiValues } from "./types/TemperaturedKpiValues";
import PageTrailstatusBar from "@/components/common/PageTrailstatusBar";
import { PAGE_DEFAULTS } from "@/context/scope/pageDefaults";
import { usePageScope } from "@/context/scope/usePageScope";
import SimpleAlertModal from "@/components/modal/SimpleAlertModal";
import { LoadingWrapper } from "@/components/common/LoadingWrapper";

const TEMP_COLORS = {
  maxAvg: "#ef4444", // red   — mean T_max
  mean: "#22c55e", // green — mean T
  minAvg: "#60a5fa", // blue  — mean T_min
} as const;

export default function Temperature() {
  const { icao, from, to, setIcao, setFrom, setTo } = usePageScope({
    pageId: "temperature",
    defaults: { ...PAGE_DEFAULTS.temperature },
  });
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const queryParams: TemperatureStatisticQueryParams = useMemo(
    () => ({
      icao,
      startYear: from,
      endYear: to,
    }),
    [icao, from, to]
  );

  const { data, isFetching, isFetched, error, refetch } = useQuery({
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
    } catch {
      setErrOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const yearAgg = groupYearly(data);
  const monthAgg = groupMonthly(data);
  const hourAgg = groupHourly(data);

  const [yearSel, setYearSel] = useState<"total" | number>("total");
  const [monthSel, setMonthSel] = useState<number>(1);
  const [mtView, setMtView] = useState<"graph" | "table">("graph");
  const [hrView, setHrView] = useState<"graph" | "table">("graph");

  const status =
    data && data.totalCount > 0
      ? "summary"
      : error === null
      ? "no-data"
      : "error";

  const monthSeries =
    yearSel === "total"
      ? monthAgg.totalSeries
      : monthAgg.seriesOf(yearSel as number);

  const monthTable =
    yearSel === "total"
      ? monthAgg.totalTable
      : monthAgg.tableOf(yearSel as number);

  const hourSeries =
    yearSel === "total"
      ? hourAgg.totalSeriesOf(monthSel)
      : hourAgg.seriesOf(Number(yearSel), monthSel);

  const hourTable =
    yearSel === "total"
      ? hourAgg.totalTableOf(monthSel)
      : hourAgg.tableOf(Number(yearSel), monthSel);

  const kpis: TemperaturedKpiValues = {
    years: yearAgg.years,
    coverageFrom: data?.coverageFrom ?? "",
    coverageTo: data?.coverageTo ?? "",
    sampleSize: data?.totalCount ?? 0,
    annualMean: yearAgg.annualMean ?? 0,
    annualMax: yearAgg.annualMax ?? 0,
    annualMin: yearAgg.annualMin ?? 0,
    isFetched,
    hasData: (data?.totalCount ?? 0) > 0,
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
        <PageTrailstatusBar page="Temperature" status={status} hint="[℃]" />

        <LoadingWrapper loading={loading || isFetching}>
          <TemperatureKpiGrid kpis={kpis} />
        </LoadingWrapper>

        <SimpleAlertModal
          open={errOpen}
          onOpenChange={setErrOpen}
          details={errDetails}
          okText="OK"
          blockOutsideClose
        />

        {/* ==== (1) 월별 관측일수: 연도별 or 합계 그래프/테이블 ==== */}
        <LoadingWrapper loading={loading || isFetching}>
          <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
            <CardHeader className="pb-2 space-y-2">
              <CardTitle className="text-base">Monthly Observed Days</CardTitle>
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
                  <LineChart
                    data={monthSeries}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthShortName" />
                    <YAxis unit="°C" allowDecimals />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="dailyMaxAvg"
                      name="mean T_max"
                      stroke={TEMP_COLORS.maxAvg}
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        stroke: TEMP_COLORS.maxAvg,
                        fill: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 4,
                        stroke: TEMP_COLORS.maxAvg,
                        fill: TEMP_COLORS.maxAvg,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="dailyMeanAvg"
                      name="mean T"
                      stroke={TEMP_COLORS.mean}
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        stroke: TEMP_COLORS.mean,
                        fill: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 4,
                        stroke: TEMP_COLORS.mean,
                        fill: TEMP_COLORS.mean,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="dailyMinAvg"
                      name="mean T_min"
                      stroke={TEMP_COLORS.minAvg}
                      strokeWidth={2}
                      dot={{
                        r: 3,
                        stroke: TEMP_COLORS.minAvg,
                        fill: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{
                        r: 4,
                        stroke: TEMP_COLORS.minAvg,
                        fill: TEMP_COLORS.minAvg,
                      }}
                    />
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
                        <th className="py-2 pr-4 overline">T</th>
                        <th className="py-2 pr-4 overline">T_max</th>
                        <th className="py-2 pr-4 overline">T_min</th>
                        <th className="py-2 pr-4">T_max</th>
                        <th className="py-2 pr-4">T_min</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthTable.map((r) => (
                        <tr
                          key={r.month}
                          className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors"
                        >
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
        </LoadingWrapper>

        {/* ==== (2) 시간별 관측횟수: 연/월 선택 그래프/테이블 + 합계 지원 ==== */}
        <LoadingWrapper loading={loading || isFetching}>
          <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
          <CardHeader className="pb-2 space-y-2">
            <CardTitle className="text-base">Hourly Observed Days</CardTitle>
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
                <LineChart
                  data={hourSeries}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis unit="°C" allowDecimals />
                  <Tooltip
                    labelFormatter={(label) =>
                      `${String(label).padStart(2, "0")}Z (UTC)`
                    }
                  />
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
                      <th className="py-2 pl-2 pr-4 overline">T</th>
                      <th className="py-2 pl-2 pr-4">T_max</th>
                      <th className="py-2 pl-2 pr-4">T_min</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourTable.map((r) => (
                      <tr
                        key={r.hour}
                        className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors"
                      >
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
        </LoadingWrapper>

        <Separator />
        {/* Next steps */}
        <div className="text-sm text-muted-foreground leading-6">
          <div className="font-medium text-foreground mb-1">
            Quick Guide — Temperature
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Set <strong>ICAO</strong> and <strong>UTC range</strong> (From
              inclusive, To exclusive). Click <strong>Search</strong>.
            </li>
            <li>
              Top cards show <strong>Sample Size</strong>,{" "}
              <strong>Annual Mean (°C)</strong>, and observed{" "}
              <strong>Max/Min (°C)</strong> within the selected range.
            </li>
            <li>
              <strong>Monthly (graph)</strong>: lines for{" "}
              <strong>mean T</strong>, <strong>mean T_max</strong>,{" "}
              <strong>mean T_min</strong> by month (°C).{" "}
            </li>
            <li>
              <strong>Hourly (graph)</strong>: <strong>mean T</strong> by{" "}
              <strong>UTC</strong> hour for the selected year/month.
            </li>
            <li>
              <strong>Table</strong>: yearly block lists{" "}
              <strong>mean T / mean T_max / mean T_min</strong> per year and a{" "}
              <strong>total</strong> row; monthly block lists the same per
              month.
            </li>
            <li className="list-none">
              <em>Overbars indicate “mean”.</em>
            </li>
            <li>
              Toggle <strong>Graph/Table</strong> anytime; refine with{" "}
              <strong>total/year</strong> and <strong>month</strong> selectors.
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
