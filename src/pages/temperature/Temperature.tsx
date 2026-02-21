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
import { monthShortNames } from "@/lib/date";
import type { TemperatureStatisticQueryParams } from "@/api/types/request/statistic/TemperatureStatisticQueryParams";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { getErrorMessage } from "@/lib/page";
import AppFooter from "@/components/common/AppFooter";
import { useTranslation } from "react-i18next";
import AdSlot from "@/components/ads/AdSlot";

const TEMP_COLORS = {
  maxAvg: "#ef4444", // red   — mean T_max
  mean: "#22c55e", // green — mean T
  minAvg: "#60a5fa", // blue  — mean T_min
} as const;

export default function Temperature() {
  const { t } = useTranslation();
  const { icao, from, to, setIcao, setFrom, setTo } = usePageScope({
    pageId: "temperature",
    defaults: { ...PAGE_DEFAULTS.temperature },
  });
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails, setErrDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const didAutoFetchRef = useRef(false);

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

  useEffect(() => {
    const err = error;
    if (err) {
      setErrDetails(getErrorMessage(err));
      setErrOpen(true);
    }
  }, [error]);

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

  useEffect(() => {
    if (didAutoFetchRef.current) {
      return;
    }
    didAutoFetchRef.current = true;
    void handleFetch();
  }, []);

  const yearAgg = groupYearly(data);
  const monthAgg = groupMonthly(data);
  const hourAgg = groupHourly(data);

  const [yearSel, setYearSel] = useState<"total" | number>("total");
  const [monthSel, setMonthSel] = useState<number>(1);
  const [mtView, setMtView] = useState<"graph" | "table">("graph");
  const [hrView, setHrView] = useState<"graph" | "table">("graph");

  const status =
    !isFetched
      ? "preview"
      : data && data.totalCount > 0
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
      <main className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-8">
        <PageTrailstatusBar page={t("analysis.pages.temperature")} status={status} hint="[℃]" />

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-slate-900">{t("analysis.guide.title")}</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
            <li>{t("analysis.guide.temperature.1")}</li>
            <li>{t("analysis.guide.temperature.2")}</li>
            <li>{t("analysis.guide.temperature.3")}</li>
            <li>{t("analysis.guide.temperature.4")}</li>
            <li>{t("analysis.guide.temperature.5")}</li>
            <li className="list-none">
              <em>{t("analysis.guide.temperature.overline")}</em>
            </li>
            <li>{t("analysis.guide.common.4")}</li>
          </ul>
        </section>

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
          <Card className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm">
            <CardHeader className="pb-2 space-y-2">
              <CardTitle className="text-base">{t("analysis.monthly.title")}</CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={String(yearSel)}
                  onValueChange={(v) =>
                    setYearSel(v === "total" ? "total" : Number(v))
                  }
                >
                  <SelectTrigger className="h-8 w-28">
                    <SelectValue placeholder={t("analysis.common.year")} />
                  </SelectTrigger>
                  <SelectContent>
                    {monthAgg.years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                    <SelectItem value="total">{t("analysis.common.total")}</SelectItem>
                  </SelectContent>
                </Select>
                <div className="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    variant={mtView === "graph" ? "default" : "secondary"}
                    onClick={() => setMtView("graph")}
                  >
                    {t("analysis.common.graph")}
                  </Button>
                  <Button
                    size="sm"
                    variant={mtView === "table" ? "default" : "secondary"}
                    onClick={() => setMtView("table")}
                  >
                    {t("analysis.common.table")}
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
                      name={t("analysis.temperature.chart.legend.meanTMax")}
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
                      name={t("analysis.temperature.chart.legend.meanT")}
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
                      name={t("analysis.temperature.chart.legend.meanTMin")}
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

                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr className="border-b border-slate-200">
                        <th className="py-2 pr-4">{t("analysis.common.month")}</th>
                        <th className="py-2 pr-4 overline">{t("analysis.temperature.table.t")}</th>
                        <th className="py-2 pr-4 overline">{t("analysis.temperature.table.tMax")}</th>
                        <th className="py-2 pr-4 overline">{t("analysis.temperature.table.tMin")}</th>
                        <th className="py-2 pr-4">{t("analysis.temperature.table.tMax")}</th>
                        <th className="py-2 pr-4">{t("analysis.temperature.table.tMin")}</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums divide-y divide-slate-100/80">
                      {monthTable.map((r) => (
                        <tr
                          key={r.month}
                          className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
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
          <Card className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm">
          <CardHeader className="pb-2 space-y-2">
            <CardTitle className="text-base">{t("analysis.hourly.title")}</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={String(yearSel)}
                onValueChange={(v) =>
                  setYearSel(v === "total" ? "total" : Number(v))
                }
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue placeholder={t("analysis.common.year")} />
                </SelectTrigger>
                <SelectContent>
                  {hourAgg.years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                  <SelectItem value="total">{t("analysis.common.total")}</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={String(monthSel)}
                onValueChange={(v) => setMonthSel(Number(v))}
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue placeholder={t("analysis.common.month")} />
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
                  {t("analysis.common.graph")}
                </Button>
                <Button
                  size="sm"
                  variant={hrView === "table" ? "default" : "secondary"}
                  onClick={() => setHrView("table")}
                >
                  {t("analysis.common.table")}
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
                  <Line type="monotone" dataKey="mean" name={t("analysis.temperature.chart.legend.meanT")} dot />
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
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr className="border-b border-slate-200">
                      <th className="py-2 pl-2 pr-4">{t("analysis.common.hour")}</th>
                      <th className="py-2 pl-2 pr-4 overline">{t("analysis.temperature.table.t")}</th>
                      <th className="py-2 pl-2 pr-4">{t("analysis.temperature.table.tMax")}</th>
                      <th className="py-2 pl-2 pr-4">{t("analysis.temperature.table.tMin")}</th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums divide-y divide-slate-100/80">
                    {hourTable.map((r) => (
                      <tr
                        key={r.hour}
                        className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
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

        <AdSlot slotKey="temperature_bottom" minHeight={260} />

        </div>
      </main>
      <AppFooter />
    </>
  );
}
