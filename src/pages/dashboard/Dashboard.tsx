import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import WindLineChart from "@/pages/dashboard/components/WindLineChart";
import { DashboardKpiCardGrid } from "@/pages/dashboard/components/DashboardKpiGrid";
import DashboardTable from "@/pages/dashboard/components/DashboardTable";
import Topbar from "@/components/topbar/Topbar";
import { monthShortNameFrom, monthShortNames, utcInputToISO } from "@/lib/date";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { DashboardKpiValues } from "@/pages/dashboard/types/DashboardKpiValues";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { WindLineData } from "./types/WindLineData";
import { round2 } from "@/lib/math";
import { getErrorMessage } from "@/lib/page";
import SimpleAlertModal from "@/components/modal/SimpleAlertModal";
import { emptyDashboardTableRows } from "./DashboardHelper";
import PageTrailstatusBar from "@/components/common/PageTrailstatusBar";
import { usePageScope } from "@/context/scope/usePageScope";
import { PAGE_DEFAULTS } from "@/context/scope/pageDefaults";
import { LoadingWrapper } from "@/components/common/LoadingWrapper";

export default function Dashboard() {
  const { icao, from, to, setIcao, setFrom, setTo } = usePageScope({
    pageId: "dashboard",
    defaults: { ...PAGE_DEFAULTS.dashboard },
  });
  const [loading, setLoading] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails, setErrDetails] = useState("");

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: utcInputToISO(from),
      endISO: utcInputToISO(to),
    }),
    [icao, from, to]
  );

  const {
    data: avg,
    isFetching: avgIsFetching,
    isFetched: avgIsFetched,
    error: avgError,
    refetch: avgRefetch,
  } = useQuery({
    queryKey: ["dashboard-avg-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchAverageSummary(basicQueryParams),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  const {
    data: tableRows,
    isFetching: tableIsFetching,
    error: tableError,
    refetch: tableRefetch,
  } = useQuery({
    queryKey: ["dashboard-table-stats", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchMonthlyCountSummary({ 
        ...basicQueryParams, 
        windPeakThreshold: 30,
        visibilityThreshold: 800,
        ceilingThreshold: 200,
        phenomenon: "SN",
        descriptor: "TS",
      }),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  const {
    data: avgWind,
    isFetching: avgWindIsFetching,
    error: avgWindError,
    refetch: avgWindRefetch,
  } = useQuery({
    queryKey: ["dashboard-avg-wind", basicQueryParams],
    queryFn: async () =>
      MetarStatisticApi.fetchAverageWindSpeedMonthly(basicQueryParams),
    enabled: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const err = avgError || tableError || avgWindError;
    if (err) {
      setErrDetails(getErrorMessage(err));
      setErrOpen(true);
    }
  }, [avgError, tableError, avgWindError]);

  async function handleFetch() {
    setLoading(true);
    try {
      const r1 = await avgRefetch();
      const r2 = await tableRefetch();
      const r3 = await avgWindRefetch();
      const e = r1.error || r2.error || r3.error;
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

  const kpis: DashboardKpiValues = useMemo(
    () => ({
      coverageFrom: avg?.coverageFrom ?? "",
      coverageTo: avg?.coverageTo ?? "",
      sampleSize: avg?.totalCount ?? 0,
      avgVisibilityM: Math.round(avg?.avgVisibilityM ?? 0),
      avgCeilingFt: Math.round(avg?.avgCeilingFt ?? 0),
      avgWindSpeedKt: Math.round(avg?.avgWindSpeedKt ?? 0),
      isFetched: avgIsFetched,
      hasData: (avg?.totalCount ?? 0) > 0,
    }),
    [avg, avgIsFetched]
  );

  const windLineData: WindLineData[] = useMemo(() => {
    const data: WindLineData[] = monthShortNames.map((m) => ({
      month: m,
      wind: 0,
    }));
    avgWind?.monthly.forEach(
      (m, i) =>
        (data[i] = {
          month: monthShortNameFrom(m.month),
          wind: round2(m.value) ?? 0,
        })
    );
    return data;
  }, [avgWind]);

  const isAnyFetching =
    loading || avgIsFetching || tableIsFetching || avgWindIsFetching;

  const status =
    avg && avg.totalCount > 0
      ? "summary"
      : avgError === null && tableError === null && avgWindError === null
      ? "no-data"
      : "error";

  return (
    <>
      {/* Topbar / Filters */}
      <Topbar
        icao={icao}
        setIcao={setIcao}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        loading={loading}
        isFetching={isAnyFetching}
        onFetch={handleFetch}
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb / Context */}
        <PageTrailstatusBar page="Dashboard" status={status} />

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-base font-medium text-foreground">대시보드 안내</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/guide"
                className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                가이드 보기
              </Link>
              <Link
                to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                샘플 리포트
              </Link>
            </div>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
            <li>ICAO와 UTC 기간(From 포함, To 미포함)을 설정한 뒤 Search를 누르세요.</li>
            <li>상단 카드: 표본수/평균 시정/평균 운고/평균 풍속을 요약합니다.</li>
            <li>차트: 선택 기간의 연월 평균 추세를 보여줍니다.</li>
            <li>테이블: 임계값 조건을 만족한 월별 일수를 집계합니다.</li>
          </ul>
        </section>

        <SimpleAlertModal
          open={errOpen}
          onOpenChange={setErrOpen}
          details={errDetails}
          okText="OK"
          blockOutsideClose
        />

        {/* KPIs */}
        <LoadingWrapper loading={loading || avgIsFetching}>
          <DashboardKpiCardGrid kpis={kpis} />
        </LoadingWrapper>
        
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LoadingWrapper loading={loading || avgWindIsFetching}>
            <WindLineChart data={windLineData} />
          </LoadingWrapper>
        </motion.div>

        {/* Table */}
        <LoadingWrapper loading={loading || tableIsFetching}>
          <DashboardTable rows={tableRows || emptyDashboardTableRows()} />
        </LoadingWrapper>
      </main>
    </>
  );
}
