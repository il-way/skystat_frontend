import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import WindLineChart from "@/components/chart/WindLineChart";
import { DashboardKpiCardGrid } from "@/components/kpi/DashboardKpiGrid";
import DashboardTable from "@/components/table/DashboardTable";
import Topbar from "@/components/topbar/Topbar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { localInputToISO, toLocalInput } from "@/lib/date";
import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import type { DashboardKpiValues } from "@/types/components/kpi/DashboardKpiValues";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const [icao, setIcao] = useState("KJFK");
  const [from, setFrom] = useState(
    toLocalInput(Date.parse("2019-01-01 00:00"))
  );
  const [to, setTo] = useState(toLocalInput(Date.parse("2023-01-01 00:00")));
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);

  const basicQueryParams: BasicQueryParams = useMemo(
    () => ({
      icao,
      startISO: localInputToISO(from),
      endISO: localInputToISO(to),
    }),
    [icao, from, to]
  );

  const {
    data: avg,
    isFetching: avgIsFetching,
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

  async function handleFetch() {
    setLoading(true);
    try {
      await avgRefetch();
      await tableRefetch();
    } finally {
      setLoading(false);
    }
  }

  const kpis: DashboardKpiValues = useMemo(
    () => ({
      sampleSize: avg?.totalCount ?? 0,
      avgVisibilityM: Math.round(avg?.avgVisibilityM ?? 0),
      avgCeilingFt: Math.round(avg?.avgCeilingFt ?? 0),
      avgWindSpeedKt: Math.round(avg?.avgWindSpeedKt ?? 0),
    }),
    [avg]
  );

  const sampleWindLineData = [
    { t: "JAN", wind: 8 },
    { t: "FEB", wind: 10 },
    { t: "MAR", wind: 12 },
    { t: "APR", wind: 14 },
    { t: "MAY", wind: 13 },
    { t: "JUN", wind: 11 },
    { t: "JUL", wind: 9 },
    { t: "AUG", wind: 7 },
    { t: "SEP", wind: 8 },
    { t: "OCT", wind: 6 },
    { t: "NOV", wind: 6 },
    { t: "DEC", wind: 6 },
  ];

  // const chartData = useMemo(() => {
  //   const hourly = (obs && (obs.hourlyDat || obs.hourlyData)) || [];
  //   const mapped = mapHourlyToChartPoints(hourly);
  //   if (mapped.length > 0) return mapped;
  //   return rows
  //     .slice()
  //     .sort((a, b) => new Date(a.time) - new Date(b.time))
  //     .map((r) => ({ t: new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), wind: r.windSpdKt }));
  // }, [obs, rows])

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
        isFetching={avgIsFetching}
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
          <Badge variant="secondary">Preview</Badge>
        </div>

        {/* KPIs */}
        <DashboardKpiCardGrid kpis={kpis} />

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <WindLineChart data={sampleWindLineData} />
        </motion.div>

        {/* Table */}
        <DashboardTable
          icao={icao}
          from={from}
          to={to}
          rows={tableRows || []}
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
