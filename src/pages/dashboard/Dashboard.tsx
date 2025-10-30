import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import WindLineChart from "@/pages/dashboard/components/WindLineChart";
import { DashboardKpiCardGrid } from "@/pages/dashboard/components/DashboardKpiGrid";
import DashboardTable from "@/pages/dashboard/components/DashboardTable";
import Topbar from "@/components/topbar/Topbar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  monthShortNameFrom,
  monthShortNames,
  toUTCInput,
  utcInputToISO,
} from "@/lib/date";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { DashboardKpiValues } from "@/pages/dashboard/types/DashboardKpiValues";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { WindLineData } from "./types/WindLineData";
import { round2 } from "@/lib/math";
import { getErrorMessage } from "@/lib/page";
import SimpleAlertModal from "@/components/modal/SimpleAlertModal";

export default function Dashboard() {
  const [icao, setIcao] = useState("KJFK");
  const [from, setFrom] = useState(toUTCInput(Date.UTC(2019, 0, 1, 0, 0)));
  const [to, setTo] = useState(toUTCInput(Date.UTC(2023, 0, 1, 0, 0)));
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
      MetarStatisticApi.fetchDashboadTableSummary(basicQueryParams),
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Analytics</span>
            <span>/</span>
            <span className="text-foreground">Dashboard</span>
          </div>
          {avg && avg.totalCount > 0 ? (
            <Badge variant="secondary">Summary</Badge>
          ) : avgError === null &&
            tableError === null &&
            avgWindError === null ? (
            <Badge variant="destructive">No Data</Badge>
          ) : (
            <Badge variant="destructive">Error</Badge>
          )}
        </div>

        {/* KPIs */}
        <DashboardKpiCardGrid kpis={kpis} />

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <WindLineChart data={windLineData} />
        </motion.div>

        {/* Table */}
        <DashboardTable
          icao={icao}
          from={from}
          to={to}
          rows={tableRows || []}
        />

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
            Next steps (실전 적용 가이드)
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              데이터 연동: TanStack Query로 <code>/metar/statistic/*</code> 조회
              훅 구성, icao/from/to를 쿼리키에 반영.
            </li>
            <li>
              컴포넌트 분리: Sidebar / Topbar / Kpi / Charts / Table 폴더화 및
              Storybook 권장.
            </li>
            <li>
              테마: 브랜드 기본색(#1D97DB)을 Tailwind theme primary에 바인딩.
            </li>
            <li>
              접근성: 키보드 포커스, 대비(AAA 근접), 로딩 라이브리전 확인.
            </li>
            <li>
              페이지: Dashboard / METAR Search / Statistics / Crosswind /
              Stations / Settings.
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
