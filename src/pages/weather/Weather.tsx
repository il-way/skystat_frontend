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
import { groupHourly, groupMonthly } from "@/lib/count";
import { monthShortNames, utcInputToISO } from "@/lib/date";
import type { WeatherCondition } from "@/api/types/request/common/Condition";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { ThresholdKpiValues } from "@/pages/threshold/types/ThresholdKpiValues";
import type { WeatherDescriptor } from "@/pages/weather/types/WeatherDescriptor";
import type { WeatherPhenomenon } from "@/pages/weather/types/WeatherPhenomenon";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { PAGE_DEFAULTS } from "@/context/scope/pageDefaults";
import { LoadingWrapper } from "@/components/common/LoadingWrapper";
import AppFooter from "@/components/common/AppFooter";
import { useTranslation } from "react-i18next";
import AdSlot from "@/components/ads/AdSlot";

export default function Weather() {
  const { t } = useTranslation();
  const targetCodes = ["FZ", "SN", "PL", "FG", "TS", "RA", "WS"] as (
    | WeatherDescriptor
    | WeatherPhenomenon
  )[];
  const { icao, from, to, threshold: target, setIcao, setFrom, setTo, setThreshold: setTarget } = usePageScope({ pageId: "weather", defaults: { ...PAGE_DEFAULTS.weather } });

  const [condition] = useState<WeatherCondition>("any");
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails, setErrDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const didAutoFetchRef = useRef(false);

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: utcInputToISO(from),
      endISO: utcInputToISO(to),
    }),
    [icao, from, to]
  );

  const { data, isFetching, isFetched, error, refetch } = useQuery({
    queryKey: ["weather-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchWeatherStatistic({
        icao,
        condition,
        list:
          (target.match(/.{2}/g) as (
            | WeatherDescriptor
            | WeatherPhenomenon
          )[]) ?? [],
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
    setLoading(true);
    try {
      const r = await refetch();
      const e = r.error;
      if (e) {
        setErrDetails(getErrorMessage(e));
        setErrOpen(true);
      }
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
      hasData: (data?.totalCount ?? 0) > 0,
    }),
    [data, monthAgg, hourAgg, isFetched]
  );

  const [yearSel, setYearSel] = useState<"total" | number>("total");
  const [monthSel, setMonthSel] = useState<number>(1);
  const [mtView, setMtView] = useState<"graph" | "table">("graph");
  const [hrView, setHrView] = useState<"graph" | "table">("graph");
  
  const status: PageTrailStatus =
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
          <div className="w-full lg:w-36 lg:shrink-0">
            <label className="mb-1 block whitespace-nowrap text-xs text-slate-600">{t("analysis.filters.weatherCode")}</label>
            <Select
              value={target}
              onValueChange={(v: WeatherDescriptor | WeatherPhenomenon) => {
                setTarget(v);
              }}
            >
              <SelectTrigger className="h-10 min-h-10 w-full rounded-xl border border-slate-300 bg-white py-1 text-slate-900">
                <SelectValue placeholder={t("analysis.filters.weatherCodePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {targetCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Content */}
      <main className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-8">
        <PageTrailstatusBar page="Weather" status={status} />

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-slate-900">{t("analysis.guide.title")}</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
            <li>{t("analysis.guide.weather.1")}</li>
            <li>{t("analysis.guide.common.2")}</li>
            <li>{t("analysis.guide.weather.3")}</li>
            <li>{t("analysis.guide.common.4")}</li>
            <li>{t("analysis.guide.weather.5")}</li>
          </ul>
        </section>

        <LoadingWrapper loading={loading || isFetching}>
          <ThresholdKpiCardGrid kpis={kpis} />
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
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr className="border-b border-slate-200">
                        <th className="py-2 pr-4">{t("analysis.common.month")}</th>
                        <th className="py-2 pr-4">{t("analysis.common.count")}</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums divide-y divide-slate-100/80">
                      {monthSeries.map((r) => (
                        <tr
                          key={r.monthShortName}
                          className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
                        >
                          <td className="py-2 pl-2 pr-4">{r.monthShortName}</td>
                          <td className="py-2 pl-2 pr-4">{r.count}</td>
                        </tr>
                      ))}
                      <tr className="font-medium">
                        <td className="py-2 pl-2 pr-4">{t("analysis.common.totalUpper")}</td>
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
                  <BarChart
                    data={hourSeries}
                    margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(label) =>
                        `${String(label).padStart(2, "0")}Z (UTC)`
                      }
                    />
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
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr className="border-b border-slate-200">
                        <th className="py-2 pl-2 pr-4">{t("analysis.common.hour")}</th>
                        <th className="py-2 pl-2 pr-4">{t("analysis.common.count")}</th>
                      </tr>
                    </thead>
                    <tbody className="tabular-nums divide-y divide-slate-100/80">
                      {hourSeries.map((r) => (
                        <tr
                          key={r.hour}
                          className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
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
        </LoadingWrapper>

        <AdSlot slotKey="weather_bottom" minHeight={260} />

        </div>
      </main>
      <AppFooter />
    </>
  );
}
