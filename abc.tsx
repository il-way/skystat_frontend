import React, { useMemo, useState, useEffect, type ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";
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
  LineChart as RLineChart,
  Line as RLine,
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

/**
 * Skystat Frontend — TypeScript edition
 * 디자인/레이아웃/텍스트는 유지. 빌드 에러(File not found: ./components/ui/*)를 제거하기 위해
 * 필요한 UI 컴포넌트를 이 파일 내에 최소 구현으로 동봉했습니다.
 *
 * NOTE: 실제 프로젝트에서는 shadcn/ui 또는 여러분의 컴포넌트 폴더로 분리해 사용하세요.
 */

// ========================================================
// Minimal UI primitives (replacing ./components/ui/* imports)
// ========================================================

// util: classnames merge (아주 간단 버전)
function cx(...cls: Array<string | undefined | false>): string {
  return cls.filter(Boolean).join(" ");
}

// ---- Card ----
export function Card({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("bg-card text-card-foreground rounded-2xl border shadow-sm", className)} {...rest}>
      {children}
    </div>
  );
}
export function CardHeader({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("p-4", className)} {...rest}>
      {children}
    </div>
  );
}
export function CardTitle({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("text-lg font-semibold truncate", className)} {...rest}>
      {children}
    </div>
  );
}
export function CardContent({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("p-4", className)} {...rest}>
      {children}
    </div>
  );
}

// ---- Button ----
export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium",
        "px-3 py-2 border bg-primary text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

// ---- Input ----
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cx(
        "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
        className
      )}
      {...rest}
    />
  )
);
Input.displayName = "Input";

// ---- Badge ----
export function Badge({ className, children, variant = "default", ...rest }: { className?: string; children: ReactNode; variant?: "default" | "secondary" } & React.ComponentPropsWithoutRef<"span">) {
  const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium";
  const styles = variant === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground";
  return (
    <span className={cx(base, styles, className)} {...rest}>
      {children}
    </span>
  );
}

// ---- Separator ----
export function Separator({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cx("h-px w-full bg-border", className)} {...rest} />;
}

// ---- Sidebar (minimal context + trigger) ----

type SidebarCtx = { open: boolean; toggle: () => void };
const SidebarContext = React.createContext<SidebarCtx | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((v) => !v);
  return <SidebarContext.Provider value={{ open, toggle }}>{children}</SidebarContext.Provider>;
}

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}

export function Sidebar({ className, children, ...rest }: React.ComponentPropsWithoutRef<"aside">) {
  const { open } = useSidebar();
  return (
    <aside
      className={cx(
        "transition-[width] duration-200 border-r bg-background",
        open ? "w-60" : "w-0 md:w-16",
        className
      )}
      {...rest}
    >
      <div className={cx(open ? "opacity-100" : "opacity-0 md:opacity-100")}>{children}</div>
    </aside>
  );
}
export function SidebarHeader({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("border-b", className)} {...rest}>
      {children}
    </div>
  );
}
export function SidebarContent({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("flex-1 overflow-y-auto", className)} {...rest}>
      {children}
    </div>
  );
}
export function SidebarFooter({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("border-t", className)} {...rest}>
      {children}
    </div>
  );
}
export function SidebarGroup({ className, children, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cx("px-2 py-2", className)} {...rest}>
      {children}
    </div>
  );
}
export function SidebarMenu({ className, children, ...rest }: React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul className={cx("space-y-1", className)} {...rest}>
      {children}
    </ul>
  );
}
export function SidebarMenuItem({ className, children, ...rest }: React.ComponentPropsWithoutRef<"li">) {
  return (
    <li className={cx("", className)} {...rest}>
      {children}
    </li>
  );
}
export function SidebarMenuButton({ className, children, ...rest }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button className={cx("w-full text-left px-3 py-2 rounded-md hover:bg-secondary/50 flex items-center gap-2", className)} {...rest}>
      {children}
    </button>
  );
}
export function SidebarTrigger({ className, ...rest }: React.ComponentPropsWithoutRef<"button">) {
  const { toggle } = useSidebar();
  return (
    <button className={cx("px-2 py-1 rounded-md border", className)} onClick={toggle} {...rest}>
      ☰
    </button>
  );
}

// =====================
// Types
// =====================
export type MetarRow = {
  id: number;
  station: string;
  time: string; // ISO8601
  windDir: number;
  windSpdKt: number;
  vis: number;
  ceiling?: number | null;
  weather: string;
  qnh: number;
};

export type KpiValues = {
  sampleSize: number;
  missingCount: number;
  avgCeiling: number;
};

export type HourlyCount = { year: number; month: number; hour: number; count: number };
export type MonthlyCount = { year: number; month: number; count: number };

export type ObservationStatisticResponse = {
  coverageFrom: string | null;
  coverageTo: string | null;
  totalCount: number;
  monthlyData: MonthlyCount[];
  hourlyData: HourlyCount[];
};

export type StatsKind = "threshold" | "weather" | "cloud" | "";

export type BackendParams = {
  icao: string;
  fromLocal: string; // datetime-local value
  toLocal: string; // datetime-local value
};

// URL builder args
type ThresholdArgs = {
  base: string;
  icao: string;
  field: string;
  comparison: string;
  threshold: number;
  unit: string;
  startISO: string;
  endISO: string;
};

type WeatherArgs = {
  base: string;
  icao: string;
  condition: string;
  list: string[];
  startISO: string;
  endISO: string;
};

type CloudArgs = {
  base: string;
  icao: string;
  condition: string;
  target: string;
  startISO: string;
  endISO: string;
};

// -------------------------------
// Dummy dataset (replace anytime)
// -------------------------------
const sampleMetars: MetarRow[] = [
  { id: 1, station: "RKSI", time: "2025-10-12T09:00:00Z", windDir: 140, windSpdKt: 12, vis: 9999, ceiling: 3500, weather: "-RA", qnh: 1017 },
  { id: 2, station: "RKSI", time: "2025-10-12T10:00:00Z", windDir: 160, windSpdKt: 16, vis: 8000, ceiling: 3000, weather: "RA",  qnh: 1015 },
  { id: 3, station: "RKSS", time: "2025-10-12T10:30:00Z", windDir: 110, windSpdKt: 8,  vis: 10000, ceiling: 5000, weather: "NSW", qnh: 1018 },
];

function fetchMetarStub({ icao, from, to }: { icao: string; from?: string; to?: string }): Promise<MetarRow[]> {
  const fromMs = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY;
  const toMs = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY;
  const icaoU = (icao || "").trim().toUpperCase();
  return Promise.resolve(
    sampleMetars.filter((m) => (!icaoU || m.station === icaoU) && new Date(m.time).getTime() >= fromMs && new Date(m.time).getTime() < toMs)
  );
}

// Simple date helper (YYYY-MM-DDTHH:mm)
function toLocalInput(dt: number | string | Date): string {
  const d = new Date(dt);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

// Extra helpers + React Query fetchers
function localInputToISO(local: string): string {
  return new Date(local).toISOString();
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

const API_BASE: string = (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL) || "";
const STATS_KIND: StatsKind = (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_STATS_KIND) || "";

function buildThresholdURL(args: ThresholdArgs): URL {
  const { base, icao } = args;
  const url = new URL(`/metar/statistic/threshold/${encodeURIComponent(icao)}`, base);
  url.searchParams.set("field", args.field);
  url.searchParams.set("comparison", args.comparison);
  url.searchParams.set("threshold", String(args.threshold));
  url.searchParams.set("unit", args.unit);
  url.searchParams.set("startDateTime", args.startISO);
  url.searchParams.set("endDateTime", args.endISO);
  return url;
}
function buildWeatherURL(args: WeatherArgs): URL {
  const { base, icao } = args;
  const url = new URL(`/metar/statistic/weather/${encodeURIComponent(icao)}`, base);
  url.searchParams.set("condition", args.condition);
  (args.list || []).forEach((v) => url.searchParams.append("list", v));
  url.searchParams.set("startDateTime", args.startISO);
  url.searchParams.set("endDateTime", args.endISO);
  return url;
}
function buildCloudURL(args: CloudArgs): URL {
  const { base, icao } = args;
  const url = new URL(`/metar/statistic/cloud/${encodeURIComponent(icao)}`, base);
  url.searchParams.set("condition", args.condition);
  url.searchParams.set("target", args.target);
  url.searchParams.set("startDateTime", args.startISO);
  url.searchParams.set("endDateTime", args.endISO);
  return url;
}

async function fetchObservationStatisticsViaBackend(params: BackendParams): Promise<ObservationStatisticResponse> {
  const { icao } = params;
  const base = API_BASE || (typeof window !== "undefined" ? window.location.origin : "");
  const startISO = localInputToISO(params.fromLocal);
  const endISO = localInputToISO(params.toLocal);
  let url: URL | null = null;
  if (STATS_KIND === "threshold") {
    const env: any = (import.meta as any).env || {};
    const field = env.VITE_METRIC_FIELD || "VISIBILITY";
    const comparison = env.VITE_COMPARISON || "LT";
    const threshold = Number(env.VITE_THRESHOLD != null ? env.VITE_THRESHOLD : 1000);
    const unit = env.VITE_UNIT || "METER";
    url = buildThresholdURL({ base, icao, field, comparison, threshold, unit, startISO, endISO });
  } else if (STATS_KIND === "weather") {
    const env: any = (import.meta as any).env || {};
    const condition = env.VITE_WEATHER_CONDITION || "HAS_PHENOMENA";
    const listRaw = env.VITE_WEATHER_LIST || "RA";
    const list = String(listRaw).split(",").map((s: string) => s.trim()).filter(Boolean);
    url = buildWeatherURL({ base, icao, condition, list, startISO, endISO });
  } else if (STATS_KIND === "cloud") {
    const env: any = (import.meta as any).env || {};
    const condition = env.VITE_CLOUD_CONDITION || "HAS_COVERAGE";
    const target = env.VITE_CLOUD_TARGET || "BKN";
    url = buildCloudURL({ base, icao, condition, target, startISO, endISO });
  }
  if (!url) throw new Error("Stats kind not configured (VITE_STATS_KIND)");
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Failed: " + res.status);
  return res.json() as Promise<ObservationStatisticResponse>;
}

function synthesizeObservationStatsFromRows(rows: MetarRow[]): ObservationStatisticResponse {
  const totalCount = rows.length;
  const byHour = new Map<string, number>();
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const d = new Date(r.time);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCHours()}`;
    byHour.set(key, (byHour.get(key) || 0) + 1);
  }
  const hourlyData: HourlyCount[] = Array.from(byHour.entries())
    .map(([k, cnt]) => {
      const parts = k.split("-");
      return { year: Number(parts[0]), month: Number(parts[1]), hour: Number(parts[2]), count: cnt };
    })
    .sort((a, b) => a.year - b.year || a.month - b.month || a.hour - b.hour);
  return {
    coverageFrom: rows[0] ? rows[0].time : null,
    coverageTo: rows.length ? rows[rows.length - 1].time : null,
    totalCount,
    monthlyData: [],
    hourlyData,
  };
}

function mapHourlyToChartPoints(list: HourlyCount[] | undefined): { t: string; wind: number }[] {
  if (!Array.isArray(list) || list.length === 0) return [];
  const sorted = list.slice().sort((a, b) => a.year - b.year || a.month - b.month || a.hour - b.hour);
  return sorted.map((h) => ({
    t: new Date(Date.UTC(h.year, (h.month || 1) - 1, 1, h.hour || 0)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    wind: h.count,
  }));
}

// ---------------------------------
// Small, re-usable UI sub-components
// ---------------------------------
function Kpi({ title, value, hint }: { title: ReactNode; value: ReactNode; hint?: ReactNode }): JSX.Element {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold leading-none tracking-tight">{value}</div>
        {hint ? <div className="text-xs text-muted-foreground mt-1">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}
function Label({ children }: { children: ReactNode }): JSX.Element {
  return <div className="text-xs font-medium text-muted-foreground mb-1">{children}</div>;
}

// -----------------
// Runtime smoke tests (kept + added)
// -----------------
function runSmokeTests(): void {
  try {
    // toLocalInput format
    const s = toLocalInput(Date.UTC(2025, 9, 12, 10, 5));
    console.assert(/T\d{2}:\d{2}$/.test(s), "toLocalInput should be YYYY-MM-DDTHH:mm");

    // fetchMetarStub filters
    const from = "2025-10-12T08:00:00Z";
    const to = "2025-10-12T11:00:00Z";
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

    const w = buildWeatherURL({ base: "http://localhost", icao: "RKSI", condition: "HAS_PHENOMENA", list: ["RA", "SN"], startISO: "2025-10-12T08:00:00Z", endISO: "2025-10-12T11:00:00Z" });
    console.assert(w.pathname.endsWith("/metar/statistic/weather/RKSI"), "weather path ok");
    console.assert(w.searchParams.getAll("list").length === 2, "weather list count ok");

    const c = buildCloudURL({ base: "http://localhost", icao: "RKSI", condition: "HAS_COVERAGE", target: "BKN", startISO: "2025-10-12T08:00:00Z", endISO: "2025-10-12T11:00:00Z" });
    console.assert(c.pathname.endsWith("/metar/statistic/cloud/RKSI"), "cloud path ok");
    console.assert(c.searchParams.get("target") === "BKN", "cloud target ok");

    // synthesizeObservationStatsFromRows
    const synth = synthesizeObservationStatsFromRows(sampleMetars);
    console.assert(synth.totalCount === 3 && Array.isArray(synth.hourlyData), "synthesized stats ok");

    // new: empty mapping
    console.assert(mapHourlyToChartPoints([]).length === 0, "empty hourly → points returns []");
  } catch (e) {
    console.error("Smoke tests failed:", e);
  }
}

// ================================
// Extracted components (no design changes)
// ================================
function SidebarNav(): JSX.Element {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <GaugeCircle className="h-5 w-5" />
            <span className="font-semibold">Skystat</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Aviation Weather Analytics</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BarChart3 className="h-4 w-4" /> Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Cloud className="h-4 w-4" /> METAR Search
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <MapPin className="h-4 w-4" /> Stations
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Wind className="h-4 w-4" /> Crosswind
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings className="h-4 w-4" /> Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <Database className="h-4 w-4" /> Backend: Spring Boot 3.9 (Assumed)
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

type TopbarProps = {
  icao: string;
  setIcao: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  loading: boolean;
  qFetching: boolean;
  onFetch: () => void;
};

function Topbar(props: TopbarProps): JSX.Element {
  const { icao, setIcao, from, setFrom, to, setTo, loading, qFetching, onFetch } = props;
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-end gap-3">
          <SidebarTrigger className="mr-1" />
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label>ICAO</Label>
              <Input value={icao} onChange={(e) => setIcao(e.target.value.toUpperCase())} placeholder="e.g., RKSI" className="w-28" />
            </div>
          </div>

          <div>
            <Label>From</Label>
            <Input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          <div>
            <Label>To</Label>
            <Input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <div className="ml-auto">
            <Button onClick={onFetch} disabled={loading || qFetching} className="rounded-2xl">
              {loading || qFetching ? "Loading..." : "Fetch"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiGrid({ kpis, rows }: { kpis: KpiValues; rows: MetarRow[] }): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Kpi title="Sample Size" value={kpis.sampleSize} hint="rows" />
      <Kpi title="Missing Count" value={kpis.missingCount} hint="확실하지 않음: 정의 필요" />
      <Kpi title="Avg Ceiling (ft)" value={kpis.avgCeiling} />
      <Kpi title="Stations" value={[...new Set(rows.map((r) => r.station))].length} />
    </div>
  );
}

function WindLineChart({ data }: { data: { t: string; wind: number }[] }): JSX.Element {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">Wind Speed Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RLineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" />
            <YAxis />
            <Tooltip />
            <RLine type="monotone" dataKey="wind" strokeWidth={2} dot={false} />
          </RLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ResultsTable({ rows, icao, from, to }: { rows: MetarRow[]; icao: string; from: string; to: string }): JSX.Element {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Count Results</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          원본 데이터: 선택된 기간(<span className="font-medium">{from}</span> ~ <span className="font-medium">{to}</span>) 동안
          <span className="font-medium ml-1">{icao}</span> 공항에서 보고된 METAR.
          집계 데이터: 각 월(month)별로 조건에 해당하는 <span className="font-medium">“일(day) 수”</span>를 누적.
          예) Month 1, WindPeak 37 → 1월에 WindPeak ≥ 30kt인 날이 총 37일.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4">Time (UTC)</th>
                <th className="py-2 pr-4">Station</th>
                <th className="py-2 pr-4">Wind</th>
                <th className="py-2 pr-4">Vis (m)</th>
                <th className="py-2 pr-4">Ceiling (ft)</th>
                <th className="py-2 pr-4">Weather</th>
                <th className="py-2 pr-4">QNH</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-none">
                  <td className="py-2 pr-4 whitespace-nowrap">{new Date(r.time).toISOString().replace(".000Z", "Z")}</td>
                  <td className="py-2 pr-4">{r.station}</td>
                  <td className="py-2 pr-4">{r.windDir}° / {r.windSpdKt} kt</td>
                  <td className="py-2 pr-4">{r.vis}</td>
                  <td className="py-2 pr-4">{r.ceiling ?? "-"}</td>
                  <td className="py-2 pr-4">{r.weather}</td>
                  <td className="py-2 pr-4">{r.qnh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================
// Root → Providers → Dashboard
// ================================
export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Dashboard />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

function Dashboard(): JSX.Element {
  const [icao, setIcao] = useState<string>("RKSI");
  const [from, setFrom] = useState<string>(toLocalInput(Date.now() - 6 * 60 * 60 * 1000));
  const [to, setTo] = useState<string>(toLocalInput(Date.now() + 60 * 60 * 1000));
  const [rows, setRows] = useState<MetarRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [queryParams, setQueryParams] = useState<BackendParams>({ icao: "RKSI", fromLocal: from, toLocal: to });
  const { data: obs, isFetching: qFetching, error: qError, refetch } = useQuery<ObservationStatisticResponse>({
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
    void handleFetch();
    runSmokeTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFetch(): Promise<void> {
    setLoading(true);
    try {
      const data = await fetchMetarStub({ icao, from, to });
      setRows(data);
      setQueryParams({ icao, fromLocal: from, toLocal: to });
      await refetch();
    } finally {
      setLoading(false);
    }
  }

  const kpis: KpiValues = useMemo(() => {
    const sampleSize = typeof obs?.totalCount === "number" ? obs.totalCount : rows.length;
    const missingCount = 0; // 정의 필요
    const avgCeiling = rows.length ? Math.round(rows.reduce((a, b) => a + (b.ceiling ?? 0), 0) / rows.length) : 0;
    return { sampleSize, missingCount, avgCeiling };
  }, [obs, rows]);

  const chartData = useMemo(() => {
    const hourly = obs?.hourlyData || [];
    const mapped = mapHourlyToChartPoints(hourly);
    if (mapped.length > 0) return mapped;
    return rows
      .slice()
      .sort((a, b) => +new Date(a.time) - +new Date(b.time))
      .map((r) => ({ t: new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), wind: r.windSpdKt }));
  }, [obs, rows]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar / Filters */}
        <Topbar
          icao={icao}
          setIcao={setIcao}
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          loading={loading}
          qFetching={qFetching}
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
          <KpiGrid kpis={kpis} rows={rows} />

          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <WindLineChart data={chartData} />
          </motion.div>

          {/* Table */}
          <ResultsTable rows={rows} icao={icao} from={from} to={to} />

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

/*
================================================================================
SPLIT VERSION (폴더 분리 템플릿) — 참고용 (주석 처리됨; 실행되지 않음)
--------------------------------------------------------------------------------
이 블록은 예시 코드이며 현재 파일에서는 주석 처리되어 있어 빌드에 포함되지 않습니다.
각 파일로 분리하려면 아래 내용을 해당 경로에 새 파일로 저장하세요.

폴더 구조 제안
src/
├─ main.tsx                          // 엔트리 + Providers
├─ app/
│  └─ App.tsx                        // 페이지 컨테이너 (UI/레이아웃 동일)
├─ components/
│  ├─ sidebar/Sidebar.tsx            // SidebarProvider, Sidebar* primitives
│  ├─ sidebar/SidebarNav.tsx         // Sidebar 네비 컴포넌트 (re-export)
│  ├─ topbar/Topbar.tsx              // 상단 필터/버튼
│  ├─ kpi/Kpi.tsx                    // 단일 KPI 카드
│  ├─ kpi/KpiGrid.tsx                // KPI 4개 그리드
│  ├─ charts/WindLineChart.tsx       // Recharts 라인차트 (Lucide 충돌 방지 alias 사용)
│  └─ table/ResultsTable.tsx         // 테이블 표시
├─ ui/
│  ├─ card.tsx
│  ├─ button.tsx
│  ├─ input.tsx
│  ├─ badge.tsx
│  ├─ separator.tsx
│  └─ label.tsx
├─ features/observations/api.ts      // fetch, URL builder, 스텁 데이터, 헬퍼
├─ lib/
│  ├─ queryClient.ts                 // React Query 클라이언트
│  ├─ utils/cx.ts                    // className merge 유틸
│  └─ types.ts                       // 전역 타입 모음
└─ dev/smoke-tests.ts                // 런타임 스모크 테스트(기존 테스트 유지)

예시 파일 내용(일부 발췌):

```ts
// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { SidebarProvider } from "./components/sidebar/Sidebar";
import App from "./app/App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

※ 나머지 파일들도 동일하게 복사해 사용하세요. 이 템플릿을 주석 해제하면 현재 파일에
-- path: src/app/App.tsx
--------------------------------------------------------------------------------
*/
// src/app/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import SidebarNav from "../components/sidebar/SidebarNav";
import Topbar from "../components/topbar/Topbar";
import KpiGrid from "../components/kpi/KpiGrid";
import WindLineChart from "../components/charts/WindLineChart";
import ResultsTable from "../components/table/ResultsTable";
import {
  fetchMetarStub,
  synthesizeObservationStatsFromRows,
  mapHourlyToChartPoints,
  toLocalInput,
} from "../features/observations/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { BackendParams, KpiValues, MetarRow, ObservationStatisticResponse, StatsKind } from "../lib/types";

const STATS_KIND: StatsKind = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_STATS_KIND) || "";

export default function App(): JSX.Element {
  const [icao, setIcao] = useState<string>("RKSI");
  const [from, setFrom] = useState<string>(toLocalInput(Date.now() - 6 * 60 * 60 * 1000));
  const [to, setTo] = useState<string>(toLocalInput(Date.now() + 60 * 60 * 1000));
  const [rows, setRows] = useState<MetarRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [queryParams, setQueryParams] = useState<BackendParams>({ icao: "RKSI", fromLocal: from, toLocal: to });
  const { data: obs, isFetching: qFetching, refetch } = useQuery<ObservationStatisticResponse>({
    queryKey: ["obs-stats", queryParams, STATS_KIND],
    queryFn: async () => {
      try {
        if (STATS_KIND) {
          const { fetchObservationStatisticsViaBackend } = await import("../features/observations/api");
          return await fetchObservationStatisticsViaBackend(queryParams);
        }
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
    void handleFetch();
    import("../dev/smoke-tests").then((m) => m.runSmokeTests?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFetch(): Promise<void> {
    setLoading(true);
    try {
      const data = await fetchMetarStub({ icao, from, to });
      setRows(data);
      setQueryParams({ icao, fromLocal: from, toLocal: to });
      await refetch();
    } finally {
      setLoading(false);
    }
  }

  const kpis: KpiValues = useMemo(() => {
    const sampleSize = typeof obs?.totalCount === "number" ? obs.totalCount : rows.length;
    const missingCount = 0;
    const avgCeiling = rows.length ? Math.round(rows.reduce((a, b) => a + (b.ceiling ?? 0), 0) / rows.length) : 0;
    return { sampleSize, missingCount, avgCeiling };
  }, [obs, rows]);

  const chartData = useMemo(() => {
    const hourly = obs?.hourlyData || [];
    const mapped = mapHourlyToChartPoints(hourly);
    if (mapped.length > 0) return mapped;
    return rows
      .slice()
      .sort((a, b) => +new Date(a.time) - +new Date(b.time))
      .map((r) => ({ t: new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), wind: r.windSpdKt }));
  }, [obs, rows]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <Topbar icao={icao} setIcao={setIcao} from={from} setFrom={setFrom} to={to} setTo={setTo} loading={loading} qFetching={qFetching} onFetch={handleFetch} />
        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Analytics</span><span>/</span><span className="text-foreground">Dashboard</span>
            </div>
            <Badge variant="secondary">Preview</Badge>
          </div>
          <KpiGrid kpis={kpis} rows={rows} />
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <WindLineChart data={chartData} />
          </motion.div>
          <ResultsTable rows={rows} icao={icao} from={from} to={to} />
          <Separator />
        </main>
      </div>
    </div>
  );
}

/*
--------------------------------------------------------------------------------
-- path: src/components/sidebar/Sidebar.tsx
--------------------------------------------------------------------------------
*/
// src/components/sidebar/Sidebar.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";
import { cx } from "../../lib/utils/cx";

export type SidebarCtx = { open: boolean; toggle: () => void };
const SidebarContext = createContext<SidebarCtx | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((v) => !v);
  return <SidebarContext.Provider value={{ open, toggle }}>{children}</SidebarContext.Provider>;
}
export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}
export function Sidebar({ className, children, ...rest }: React.ComponentPropsWithoutRef<"aside">) {
  const { open } = useSidebar();
  return (
    <aside className={cx("transition-[width] duration-200 border-r bg-background", open ? "w-60" : "w-0 md:w-16", className)} {...rest}>
      <div className={cx(open ? "opacity-100" : "opacity-0 md:opacity-100")}>{children}</div>
    </aside>
  );
}
export function SidebarHeader(p: React.ComponentPropsWithoutRef<"div">) { return <div {...p} className={cx("border-b", p.className)} />; }
export function SidebarContent(p: React.ComponentPropsWithoutRef<"div">) { return <div {...p} className={cx("flex-1 overflow-y-auto", p.className)} />; }
export function SidebarFooter(p: React.ComponentPropsWithoutRef<"div">) { return <div {...p} className={cx("border-t", p.className)} />; }
export function SidebarGroup(p: React.ComponentPropsWithoutRef<"div">) { return <div {...p} className={cx("px-2 py-2", p.className)} />; }
export function SidebarMenu(p: React.ComponentPropsWithoutRef<"ul">) { return <ul {...p} className={cx("space-y-1", p.className)} />; }
export function SidebarMenuItem(p: React.ComponentPropsWithoutRef<"li">) { return <li {...p} className={cx("", p.className)} />; }
export function SidebarMenuButton(p: React.ComponentPropsWithoutRef<"button">) { return <button {...p} className={cx("w-full text-left px-3 py-2 rounded-md hover:bg-secondary/50 flex items-center gap-2", p.className)} />; }
export function SidebarTrigger({ className, ...rest }: React.ComponentPropsWithoutRef<"button">) {
  const { toggle } = useSidebar();
  return <button className={cx("px-2 py-1 rounded-md border", className)} onClick={toggle} {...rest}>☰</button>;
}

export default function SidebarNav(): JSX.Element {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="px-3 py-2">
          <div className="flex items-center gap-2"><span className="font-semibold">Skystat</span></div>
          <div className="text-xs text-muted-foreground mt-1">Aviation Weather Analytics</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem><SidebarMenuButton>Dashboard</SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton>METAR Search</SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton>Stations</SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton>Crosswind</SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton>Settings</SidebarMenuButton></SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-xs text-muted-foreground">Backend: Spring Boot 3.9 (Assumed)</div>
      </SidebarFooter>
    </Sidebar>
  );
}

/*
--------------------------------------------------------------------------------
-- path: src/components/sidebar/SidebarNav.tsx
------------

/*
================================================================================
SPLIT VERSION (폴더 분리 템플릿)
--------------------------------------------------------------------------------
아래 블록을 각 파일로 복사해 프로젝