import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import {
  BarChart3,
  Cloud,
  GaugeCircle,
  MapPin,
  Settings,
  Wind,
  Search,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { KpiCardGrid } from "./components/kpi/KpiGrid";
import type { KpiValues } from "./types/components/kpi/KpiValues";
import Topbar from "./components/topbar/Topbar";
import WindLineChart from "./components/chart/WindLineChart";
import ResultsTable from "./components/table/ResultsTable";
import SidebarNav from "./components/sidebar/SidebarNav";
import { localInputToISO, toLocalInput } from "./lib/date";

/**
 * Skystat Frontend — Provider Order FIX
 * -------------------------------------
 * 오류 해결: "No QueryClient set" → useQuery가 Provider 밖에서 호출되던 구조를 분리했습니다.
 * - 최상단 default export(AppRoot)에서 <QueryClientProvider>로 감싼 뒤,
 *   그 안에서 <SidebarProvider> → <Dashboard/> 순으로 렌더링합니다.
 * - useQuery 훅은 이제 <QueryClientProvider> 내부의 <Dashboard/>에서만 호출됩니다.
 *
 * 디자인은 절대 변경하지 않았습니다(레이아웃/클래스/텍스트 동일).
 */

// -------------------------------
// Dummy dataset (replace anytime)
// -------------------------------
const sampleMetars = [
  { id: 1, station: "RKSI", time: "2025-10-12T09:00:00Z", windDir: 140, windSpdKt: 12, vis: 9999, ceiling: 3500, weather: "-RA", qnh: 1017 },
  { id: 2, station: "RKSI", time: "2025-10-12T10:00:00Z", windDir: 160, windSpdKt: 16, vis: 8000, ceiling: 3000, weather: "RA",  qnh: 1015 },
  { id: 3, station: "RKSS", time: "2025-10-12T10:30:00Z", windDir: 110, windSpdKt: 8,  vis: 10000, ceiling: 5000, weather: "NSW", qnh: 1018 },
];

function fetchMetarStub({ icao, from, to }) {
  const fromMs = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY;
  const toMs = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY;
  const icaoU = (icao || "").trim().toUpperCase();
  return Promise.resolve(
    sampleMetars.filter((m) =>
      (!icaoU || m.station === icaoU) &&
      new Date(m.time).getTime() >= fromMs &&
      new Date(m.time).getTime() < toMs
    )
  );
}

// React Query: client & env
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      placeholderData: keepPreviousData,
    },
  },
});

const API_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "";
const STATS_KIND = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_STATS_KIND) || ""; // "threshold"|"weather"|"cloud"

function buildThresholdURL(args) {
  const base = args.base; const icao = args.icao;
  const url = new URL('/metar/statistic/threshold/' + encodeURIComponent(icao), base);
  url.searchParams.set('field', args.field);
  url.searchParams.set('comparison', args.comparison);
  url.searchParams.set('threshold', String(args.threshold));
  url.searchParams.set('unit', args.unit);
  url.searchParams.set('startDateTime', args.startISO);
  url.searchParams.set('endDateTime', args.endISO);
  return url;
}



function synthesizeObservationStatsFromRows(rows) {
  var totalCount = rows.length; var byHour = new Map();
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i]; var d = new Date(r.time);
    var key = d.getUTCFullYear() + '-' + (d.getUTCMonth() + 1) + '-' + d.getUTCHours();
    byHour.set(key, (byHour.get(key) || 0) + 1);
  }
  var hourlyDat = Array.from(byHour.entries())
    .map(function(e){ var parts = e[0].split('-'); return { year: Number(parts[0]), month: Number(parts[1]), hour: Number(parts[2]), count: e[1] }; })
    .sort(function(a,b){ return (a.year - b.year) || (a.month - b.month) || (a.hour - b.hour); });
  return { coverageFrom: rows[0] ? rows[0].time : null, coverageTo: rows.length ? rows[rows.length - 1].time : null, totalCount: totalCount, monthlyData: [], hourlyDat: hourlyDat };
}

function mapHourlyToChartPoints(list) {
  if (!Array.isArray(list) || list.length === 0) return [];
  var sorted = list.slice().sort(function(a,b){ return (a.year - b.year) || (a.month - b.month) || (a.hour - b.hour); });
  return sorted.map(function(h){
    return { t: new Date(Date.UTC(h.year, (h.month || 1) - 1, 1, h.hour || 0)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), wind: h.count };
  });
}

// ---------------------------------
// Small, re-usable UI sub-components
// ---------------------------------

function Label({ children }) {
  return <div className="text-xs font-medium text-muted-foreground mb-1">{children}</div>;
}

// -----------------
// Runtime smoke tests (kept + added)
// -----------------
function runSmokeTests() {
  try {
    // toLocalInput format
    const s = toLocalInput(Date.UTC(2025, 9, 12, 10, 5));
    console.assert(/T\d{2}:\d{2}$/.test(s), "toLocalInput should be YYYY-MM-DDTHH:mm");

    // fetchMetarStub filters
    const from = "2025-10-12T08:00:00Z"; const to = "2025-10-12T11:00:00Z";
    fetchMetarStub({ icao: "RKSI", from, to }).then((rows) => {
      console.assert(rows.length === 2, "Expected 2 RKSI records between 08:00-11:00Z");
      console.assert(rows.every((r) => r.station === "RKSI"), "All rows must be RKSI");
    });
    fetchMetarStub({ icao: "", from, to }).then((rows) => {
      console.assert(rows.length === 3, "Expected 3 records in window for any ICAO");
    });

    // hourly → points mapping
    const mapped = mapHourlyToChartPoints([
      { year: 2025, month: 10, hour: 7, count: 2 },
      { year: 2025, month: 10, hour: 9, count: 4 },
      { year: 2025, month: 10, hour: 8, count: 3 },
    ]);
    console.assert(mapped.length === 3, "hourly → points length ok");
    console.assert(mapped[0].wind === 2 && mapped[2].wind === 4, "sorted asc by hour");

    // URL builders
    const u = buildThresholdURL({ base: "http://localhost", icao: "RKSI", field: "VISIBILITY", comparison: "LT", threshold: 1000, unit: "METER", startISO: "2025-10-12T08:00:00Z", endISO: "2025-10-12T11:00:00Z" });
    console.assert(u.pathname.endsWith("/metar/statistic/threshold/RKSI"), "threshold path ok");
    console.assert(u.searchParams.get("threshold") === "1000", "threshold param ok");

    const w = buildWeatherURL({ base: "http://localhost", icao: "RKSI", condition: "HAS_PHENOMENA", list: ["RA","SN"], startISO: "2025-10-12T08:00:00Z", endISO: "2025-10-12T11:00:00Z" });
    console.assert(w.pathname.endsWith("/metar/statistic/weather/RKSI"), "weather path ok");
    console.assert(w.searchParams.getAll("list").length === 2, "weather list count ok");

    const c = buildCloudURL({ base: "http://localhost", icao: "RKSI", condition: "HAS_COVERAGE", target: "BKN", startISO: "2025-10-12T08:00:00Z", endISO: "2025-10-12T11:00:00Z" });
    console.assert(c.pathname.endsWith("/metar/statistic/cloud/RKSI"), "cloud path ok");
    console.assert(c.searchParams.get("target") === "BKN", "cloud target ok");

    // synthesizeObservationStatsFromRows
    const synth = synthesizeObservationStatsFromRows(sampleMetars);
    console.assert(synth.totalCount === 3 && Array.isArray(synth.hourlyDat), "synthesized stats ok");
  } catch (e) {
    console.error("Smoke tests failed:", e);
  }
}

// ================================
// Root → Providers → Dashboard
// ================================
export default function App() {
  // Top-level provider to guarantee React Query context is available
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Dashboard />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

function Dashboard() {
  const [icao, setIcao] = useState("RKSI");
  const [from, setFrom] = useState(toLocalInput(Date.now() - 6 * 60 * 60 * 1000));
  const [to, setTo] = useState(toLocalInput(Date.now() + 60 * 60 * 1000));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [queryParams, setQueryParams] = useState({ icao: "RKSI", fromLocal: from, toLocal: to });
  const { data: obs, isFetching: qFetching, error: qError, refetch } = useQuery({
    queryKey: ["obs-stats", queryParams, STATS_KIND],
    queryFn: async () => {
      try {
        if (STATS_KIND) return await fetchObservationStatisticsViaBackend(queryParams);
      } catch (e) {
        console.warn("Backend fetch failed, fallback to synthesized stats:", e);
      }
      const r = await fetchMetarStub({ icao: queryParams.icao, from: queryParams.fromLocal, to: queryParams.toLocal });
      return synthesizeObservationStatsFromRows(r);
    },
    enabled: Boolean(queryParams.fromLocal && queryParams.toLocal),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    handleFetch();
    runSmokeTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFetch() {
    setLoading(true);
    try {
      const data = await fetchMetarStub({ icao, from, to });
      setRows(data);
      setQueryParams({ icao: icao, fromLocal: from, toLocal: to });
      await refetch();
    } finally {
      setLoading(false);
    }
  }

  const kpis: KpiValues = useMemo(() => {
    const sampleSize = typeof obs?.totalCount === "number" ? obs.totalCount : rows.length;
    const avgVisibility = 1600;
    const avgCeiling = rows.length
      ? Math.round(rows.reduce((a, b) => a + (b.ceiling ?? 0), 0) / rows.length)
      : 0;
    const avgWindSpeed = 12;
    return { sampleSize, avgVisibility, avgCeiling, avgWindSpeed };
  }, [obs, rows]);

  const chartData = useMemo(() => {
    const hourly = (obs && (obs.hourlyDat || obs.hourlyData)) || [];
    const mapped = mapHourlyToChartPoints(hourly);
    if (mapped.length > 0) return mapped;
    return rows
      .slice()
      .sort((a, b) => new Date(a.time) - new Date(b.time))
      .map((r) => ({ t: new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), wind: r.windSpdKt }));
  }, [obs, rows]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar / Filters */}
        <Topbar icao={icao} setIcao={setIcao}
                from={from} setFrom={setFrom}
                to={from} setTo={setFrom}
                loading={loading} 
                qFetching={qFetching} onFetch={handleFetch}
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
          <KpiCardGrid kpis={kpis} rows={rows} />

          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <WindLineChart data={chartData} />
          </motion.div>

          {/* Table */}
          <ResultsTable rows={rows} />

          <Separator />

          {/* Next steps */}
          <div className="text-sm text-muted-foreground leading-6">
            <div className="font-medium text-foreground mb-1">Next steps (실전 적용 가이드)</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>데이터 연동: TanStack Query로 <code>/metar/statistic/*</code> 조회 훅 구성, icao/from/to를 쿼리키에 반영.</li>
              <li>컴포넌트 분리: Sidebar / Topbar / Kpi / Charts / Table 폴더화 및 Storybook 권장.</li>
              <li>테마: 브랜드 기본색(#1D97DB)을 Tailwind theme primary에 바인딩.</li>
              <li>접근성: 키보드 포커스, 대비(AAA 근접), 로딩 라이브리전 확인.</li>
              <li>페이지: Dashboard / METAR Search / Statistics / Crosswind / Stations / Settings.</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
