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
import { groupHourly, groupMonthly } from "@/lib/count";
import { localInputToISO, monthShortNames, toLocalInput } from "@/lib/date";
import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import type { ThresholdKpiValues } from "@/types/components/kpi/ThresholdKpiValues";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Visibility() {
  const [icao, setIcao] = useState("KJFK");
  const [from, setFrom] = useState(
    toLocalInput(Date.parse("2019-01-01 00:00"))
  );
  const [to, setTo] = useState(toLocalInput(Date.parse("2023-01-01 00:00")));
  const [thresholdM, setThresholdM] = useState<number>(800);

  const [loading, setLoading] = useState(false);

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: localInputToISO(from),
      endISO: localInputToISO(to),
    }),
    [icao, from, to]
  );

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["visibility-threshold-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchThresholdStatistic({
        icao,
        field: "visibility",
        comparison: "LTE",
        threshold: thresholdM,
        unit: "METERS",
        startISO: basicQueryParams.startISO,
        endISO: basicQueryParams.endISO,
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

  const monthAgg = groupMonthly(data);
  const hourAgg = groupHourly(data);

  const kpis: ThresholdKpiValues = useMemo(
    () => ({
      coverageFrom: data?.coverageFrom ?? "",
      coverageTo: data?.coverageTo ?? "",
      sampleSize: data?.totalCount ?? 0,
      totalDaysCount: monthAgg.totalDaysCount ?? 0,
      mostFrequentMonth: monthAgg.mostFrequentMonth ?? "JAN",
      mostFrequentHour:
        hourAgg.mostFrequentHour(monthAgg.mostFrequentMonth) ?? "00",
    }),
    [data, monthAgg, hourAgg]
  );

  const [yearSel, setYearSel] = useState<"total" | number>("total");
  const [monthSel, setMonthSel] = useState<number>(1);
  const [mtView, setMtView] = useState<"graph" | "table">("graph");
  const [hrView, setHrView] = useState<"graph" | "table">("graph");

  const monthSeries =
    yearSel === "total"
      ? monthAgg.totalSeries
      : monthAgg.seriesOf(yearSel as number);

  const hourSeries =
    yearSel === "total"
      ? hourAgg.totalOf(monthSel)
      : hourAgg.byYearMonth(Number(yearSel), monthSel);

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
        rightSlot={
          <div className="flex items-end gap-3 mr-3">
            <div className="flex">
              <div className="flex items-center text-sm px-2">Visibility ≤</div>
              <input
                type="number"
                min={0}
                className="h-9 w-28 rounded-md border text-muted-foreground bg-background px-2 text-sm"
                value={thresholdM}
                onChange={(e) =>
                  setThresholdM(Math.max(0, Number(e.target.value)))
                }
              />
            </div>
          </div>
        }
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Analytics</span>
            <span>/</span>
            <span className="text-foreground">Visibility</span>
            <Hint text="[m]"/>
          </div>
          {data && data.totalCount > 0
            ? <Badge variant="secondary">Summary</Badge>
            : error === null 
              ? <Badge variant="destructive">No Data</Badge>
              : <Badge variant="destructive">Error</Badge>
          }          
        </div>

        <ThresholdKpiCardGrid kpis={kpis} />

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
              <ChartAutoSizer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthSeries}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthShortName" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartAutoSizer>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead className="text-left text-muted-foreground border-b">
                    <tr>
                      <th className="py-2 pr-4">Month</th>
                      <th className="py-2 pr-4">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthSeries.map((r) => (
                      <tr
                        key={r.monthShortName}
                        className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-2 pl-2 pr-4">{r.monthShortName}</td>
                        <td className="py-2 pl-2 pr-4">{r.count}</td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td className="py-2 pl-2 pr-4">TOTAL</td>
                      <td className="py-2 pl-2 pr-4">
                        {monthSeries.reduce((a, b) => a + b.count, 0)}
                      </td>
                    </tr>
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
              <ChartAutoSizer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourSeries}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartAutoSizer>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                  </colgroup>
                  <thead className="text-left text-muted-foreground border-b">
                    <tr>
                      <th className="py-2 pl-2 pr-4">Hour</th>
                      <th className="py-2 pl-2 pr-4">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourSeries.map((r) => (
                      <tr key={r.hour} className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors">
                        <td className="py-2 pl-2 pr-4">{r.hour}Z</td>
                        <td className="py-2 pl-2 pr-4">{r.count}</td>
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
