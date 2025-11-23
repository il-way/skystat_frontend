import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import { ThresholdKpiCardGrid } from "@/pages/threshold/components/ThresholdKpiGrid";
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
import { groupHourly, groupMonthly } from "@/lib/count";
import { monthShortNames, utcInputToISO } from "@/lib/date";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { ThresholdKpiValues } from "@/pages/threshold/types/ThresholdKpiValues";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getErrorMessage } from "@/lib/page";
import SimpleAlertModal from "@/components/modal/SimpleAlertModal";
import type { PageTrailStatus } from "@/components/common/types/PageTrailStatus";
import PageTrailstatusBar from "@/components/common/PageTrailstatusBar";
import { usePageScope } from "@/context/scope/usePageScope";
import { PAGE_DEFAULTS, PAGE_ID_THRESHOLD } from "@/context/scope/pageDefaults";

export default function Wind() {
  const { icao, from, to, threshold, setIcao, setFrom, setTo, setThreshold: setThreshold } = usePageScope({ pageId: "wind", defaults: { ...PAGE_DEFAULTS.wind } });
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails, setErrDetails] = useState("");

  const [loading, setLoading] = useState(false);

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: utcInputToISO(from),
      endISO: utcInputToISO(to),
    }),
    [icao, from, to]
  );

  const { data, isFetching, isFetched, error, refetch } = useQuery({
    queryKey: ["wind-threshold-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchThresholdStatistic({
        icao,
        field: "windpeak",
        comparison: "GTE",
        threshold,
        unit: "KT",
        startISO: basicQueryParams.startISO,
        endISO: basicQueryParams.endISO,
      }),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const err = error;
    if (err) {
      setErrDetails(getErrorMessage(err));
      setErrOpen(true);
    }
  }, [error]);

  async function handleFetch() {
    const thresholdMin = PAGE_ID_THRESHOLD["visibility"].min;
    const thresholdMax = PAGE_ID_THRESHOLD["visibility"].max;

    if (Number(threshold) < thresholdMin || Number(threshold) > thresholdMax) {
      setErrDetails(`Value must be range ${thresholdMin} ~ ${thresholdMax}KT`);
      setErrOpen(true);
      return;
    }

    setLoading(true);
    try {
      const r = await refetch();
      const e = r.error;
      if (e) {
        setErrDetails(getErrorMessage(e));
        setErrOpen(true);
      }
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
      isFetched,
      hasData: isFetched && (data?.totalCount ?? 0) > 0,
    }),
    [data, monthAgg, hourAgg, isFetched]
  );

  const status: PageTrailStatus = data && data.totalCount > 0 
    ? "summary" 
    : error === null ? "no-data" : "error";

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
              <div className="flex items-center text-sm px-2">Wind ≥</div>
              <input
                type="number"
                min={0}
                max={99}
                className="h-9 w-28 rounded-md border text-muted-foreground bg-background px-2 text-sm"
                value={threshold}
                onChange={(e) =>
                  setThreshold(Math.max(0, Number(e.target.value)).toString())
                }
              />
            </div>
          </div>
        }
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <PageTrailstatusBar page="Wind" status={status} hint="[kt]" />

        <ThresholdKpiCardGrid kpis={kpis} />

        {/* ==== (1) 월별 관측일수: 연도별 or 합계 그래프/테이블 ==== */}
        <Card className="rounded-2xl w-full min-w-0 overflow-hidden">
          <CardHeader className="pb-2 space-y-2">
            <CardTitle className="text-base">
              Monthly Observed Days
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
              Hourly Observed Days
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
                  <BarChart
                    data={hourSeries}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis allowDecimals={false} />
                    <Tooltip labelFormatter={(label) => `${String(label).padStart(2, "0")}Z (UTC)`}/>
                    <Bar dataKey="count" />
                  </BarChart>
                </ResponsiveContainer>
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
                      <tr
                        key={r.hour}
                        className="border-b last:border-none odd:bg-muted/30 hover:bg-muted/40 transition-colors"
                      >
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

        <SimpleAlertModal
          open={errOpen}
          onOpenChange={setErrOpen}
          details={errDetails}
          okText="OK"
          blockOutsideClose
        />

        <Separator />
        {/* Next steps */}
        <div className="text-sm text-muted-foreground leading-6">
          <div className="font-medium text-foreground mb-1">
            Quick Guide — Wind
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Set <strong>ICAO</strong> and <strong>UTC range</strong> (From
              inclusive, To exclusive). Set <strong>Wind ≤ N kt (gusts included)</strong>.
              Click <strong>Search</strong>.
            </li>
            <li>
              Top cards summarize <strong>Sample Size</strong>,{" "}
              <strong>Total Observed Days</strong>, and{" "}
              <strong>most-frequent month/hour</strong>.
            </li>
            <li>
              <strong>Monthly</strong> shows days per month meeting the
              threshold. <strong>Hourly</strong> shows counts by{" "}
              <strong>UTC</strong> hour for the selected year/month.
            </li>
            <li>
              Toggle <strong>Graph/Table</strong> anytime; refine with{" "}
              <strong>total/year</strong> and <strong>month</strong> selectors.
            </li>
            <li>
              Tip: Adjust the threshold to compare scenarios; all numbers
              reflect your selected range & threshold.
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
