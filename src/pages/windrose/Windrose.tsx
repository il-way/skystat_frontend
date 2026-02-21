import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import Hint from "@/components/common/Hint";
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
import { monthShortNames, toUTCInputFrom, utcInputToISO } from "@/lib/date";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ResponsiveContainer } from "recharts";
import ReactEChartsCore from "echarts-for-react/lib/core";
import echarts from "@/utils/echarts";
import { buildEchartOptions, buildWindroseDataset } from "./WindroseHelper";
import { getErrorMessage } from "@/lib/page";
import SimpleAlertModal from "@/components/modal/SimpleAlertModal";
import type { PageTrailStatus } from "@/components/common/types/PageTrailStatus";
import PageTrailstatusBar from "@/components/common/PageTrailstatusBar";
import type { WindroseKpiValues } from "./type/WindroseKpiValues";
import { WindroseKpiGrid } from "./WindroseKpiGrid";
import { usePageScope } from "@/context/scope/usePageScope";
import { PAGE_DEFAULTS } from "@/context/scope/pageDefaults";
import { LoadingWrapper } from "@/components/common/LoadingWrapper";
import AppFooter from "@/components/common/AppFooter";
import { useTranslation } from "react-i18next";
import AdSlot from "@/components/ads/AdSlot";

export default function Windrose() {
  const { t } = useTranslation();
  const { icao, from, to, setIcao, setFrom, setTo } = usePageScope({ pageId: "windrose", defaults: { ...PAGE_DEFAULTS.windrose } });
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails, setErrDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const didAutoFetchRef = useRef(false);

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: utcInputToISO(toUTCInputFrom(from)),
      endISO: utcInputToISO(toUTCInputFrom(to)),
    }),
    [icao, from, to]
  );

  const { data, isFetching, isFetched, error, refetch } = useQuery({
    queryKey: ["windrose-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchWindRoseStatistic({
        icao,
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

  const [monthSel, setMonthSel] = useState<number>(1);
  const [view, setView] = useState<"graph" | "table">("graph");
  const dataset = useMemo(() => buildWindroseDataset(data), [data]);
  const echartOptions = useMemo(
    () => buildEchartOptions(dataset, monthSel),
    [dataset, monthSel]
  );

  const status: PageTrailStatus =
    !isFetched
      ? "preview"
      : data && data.totalCount > 0
      ? "summary"
      : error === null
      ? "no-data"
      : "error";

  const hasData =
    dataset.directionBins.length > 0 &&
    dataset.speedBins.length > 0 &&
    dataset.series[monthShortNames[monthSel - 1]]?.length > 0;

  const kpis: WindroseKpiValues = {
    coverageFrom: data?.coverageFrom ?? "",
    coverageTo: data?.coverageTo ?? "",
    totalCount: data?.totalCount ?? 0,
    sampleSize: data?.sampleSize ?? 0,
    variableSize: data?.variableSize ?? 0,
    speedBins: dataset.speedBins ?? [],
    directionBins: dataset.directionBins ?? [],
    isFetched,
    hasData: data ? data.sampleSize > 0 : false,
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

      <main className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-8">
        <PageTrailstatusBar page={t("analysis.pages.windrose")} status={status} hint={t("analysis.windrose.gustHint")} />

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-slate-900">{t("analysis.guide.title")}</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
            <li>{t("analysis.guide.windrose.1")}</li>
            <li>{t("analysis.guide.windrose.2")}</li>
            <li>{t("analysis.guide.windrose.3", { count: dataset.directionBins.length })}</li>
            <li>{t("analysis.guide.windrose.4")}</li>
            <li>{t("analysis.guide.windrose.5")}</li>
          </ul>
        </section>

        <LoadingWrapper loading={loading || isFetching}>
          <WindroseKpiGrid kpis={kpis} />
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
              <CardTitle className="text-base">
                {t("analysis.windrose.monthlyDistTitle")}
              </CardTitle>
              <div className="flex items-center gap-2">
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
                    variant={view === "graph" ? "default" : "secondary"}
                    onClick={() => setView("graph")}
                  >
                    {t("analysis.common.graph")}
                  </Button>
                  <Button
                    size="sm"
                    variant={view === "table" ? "default" : "secondary"}
                    onClick={() => setView("table")}
                  >
                    {t("analysis.common.table")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent
              className={`w-full min-w-0 ${view === "graph" ? "h-160" : ""}`}
            >
              {view === "graph" ? (
                <div className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <div className="w-full">
                      {hasData ? (
                        <ReactEChartsCore
                          echarts={echarts}
                          option={echartOptions}
                          style={{ width: "100%", height: "100%" }}
                          notMerge={true}
                          lazyUpdate={true}
                        />
                      ) : (
                        <Hint text={t("analysis.windrose.noData")} />
                      )}
                    </div>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <colgroup>
                      <col className="w-1/7" />
                      <col className="w-1/7" />
                      <col className="w-1/7" />
                      <col className="w-1/7" />
                      <col className="w-1/7" />
                      <col className="w-1/7" />
                      <col className="w-1/7" />
                    </colgroup>
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr className="border-b border-slate-200">
                        <th className="py-2 pr-4 text-right">{t("analysis.windrose.direction")}</th>
                        {dataset.speedBins
                          .filter((s) => s.toUpperCase() !== "CALM")
                          .map((s) => (
                            <th key={s} className="py-2 pr-4 text-center">
                              {s}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="tabular-nums divide-y divide-slate-100/80">
                      {dataset.directionBins.map((r, i) => (
                        <tr
                          key={r}
                          className="odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-slate-100/60"
                        >
                          <td className="py-2 pr-4 font-medium text-right">
                            {r}
                          </td>
                          {dataset.series[monthShortNames[monthSel - 1]]
                            .filter((s) => s.speedBin.toUpperCase() !== "CALM")
                            .map((s) => (
                              <td
                                key={s.speedBin}
                                className="py-2 pl-2 pr-4 text-center"
                              >
                                {s.data[i]}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </LoadingWrapper>

        <AdSlot slotKey="windrose_bottom" minHeight={260} />

        </div>
      </main>
      <AppFooter />
    </>
  );
}
