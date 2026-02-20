import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDown, ArrowUp, ArrowUpDown, Cloud, Eye, Info, Snowflake, Wind, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import PageContainer from "../../components/layout/PageContainer";
import { getReportMock } from "../../lib/reportMock";
import type { ReportMock } from "../../lib/reportMock";
import { useSeo } from "../../lib/seo";

import {
  fetchAverageMetrics,
  fetchMonthlyObservationCounts,
  type MonthlyObservationCounts,
} from "../../api/metarSummayApi";
import { fetchMonthlyAverage } from "../../api/metarTrendApi";

function buildFallbackReport(icao: string): ReportMock {
  return {
    icao,
    airportName: "샘플 공항",
    region: "공개 예시 데이터",
    period: "2023-01-01 ~ 2024-01-01",
    summary:
      "요청한 ICAO의 사전 정의 데이터가 없어 기본 예시 값으로 보고서를 표시합니다.",
    sampleCount: 0,
    avgVisibilityKm: 0,
    avgCeilingFt: 0,
    avgWindSpeedKt: 0,
    windSeries: [
      { month: "2023-01", value: 0 },
      { month: "2023-03", value: 0 },
      { month: "2023-05", value: 0 },
      { month: "2023-07", value: 0 },
      { month: "2023-09", value: 0 },
      { month: "2023-11", value: 0 },
      { month: "2024-01", value: 0 },
    ],
    visSeries: [
      { month: "2023-01", value: 0 },
      { month: "2023-03", value: 0 },
      { month: "2023-05", value: 0 },
      { month: "2023-07", value: 0 },
      { month: "2023-09", value: 0 },
      { month: "2023-11", value: 0 },
      { month: "2024-01", value: 0 },
    ],
    monthlyObservedDays: [
      { month: "2023-01", days: 0 },
      { month: "2023-02", days: 0 },
      { month: "2023-03", days: 0 },
      { month: "2023-04", days: 0 },
      { month: "2023-05", days: 0 },
      { month: "2023-06", days: 0 },
      { month: "2023-07", days: 0 },
      { month: "2023-08", days: 0 },
      { month: "2023-09", days: 0 },
      { month: "2023-10", days: 0 },
      { month: "2023-11", days: 0 },
      { month: "2023-12", days: 0 },
    ],
    disclaimer:
      "표시된 수치는 예시 데이터이며 실제 운항 의사결정에 사용될 수 없습니다. 공식 기상 정보와 운항 지침을 확인하세요.",
  };
}

const OBS = {
  windPeak: 30,
  visibility: 800,
  ceiling: 300,
  phenomenon: "TS",
  descriptor: "SN",
};

const DATA_MIN = "2010-01-01";
const DATA_MAX_INCLUSIVE = "2025-12-31";

function ym(row: { year: number; month: number }) {
  return `${row.year}-${String(row.month).padStart(2, "0")}`;
}

function toDateOnly(value: string) {
  return value.slice(0, 10);
}

function toInclusiveEndDate(exclusiveTo: string) {
  const dateOnly = toDateOnly(exclusiveTo);
  const date = new Date(`${dateOnly}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateOnly;
  }
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function formatUtcDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDateOnlyUtc(value: string) {
  const date = new Date(`${toDateOnly(value)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function addDaysUtc(value: string, days: number) {
  const date = parseDateOnlyUtc(value);
  if (!date) {
    return toDateOnly(value);
  }
  date.setUTCDate(date.getUTCDate() + days);
  return formatUtcDate(date);
}

function addYearsUtc(value: string, years: number) {
  const date = parseDateOnlyUtc(value);
  if (!date) {
    return toDateOnly(value);
  }
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return formatUtcDate(date);
}

function todayUtcDateOnly() {
  return formatUtcDate(new Date());
}

function minDateOnly(a: string, b: string) {
  return a <= b ? a : b;
}

function pickPeakMonth(
  rows: MonthlyObservationCounts[],
  selector: (row: MonthlyObservationCounts) => number
) {
  if (!rows.length) {
    return null;
  }

  let bestRow: MonthlyObservationCounts | null = null;
  let bestValue = -Infinity;
  let bestRank = -Infinity;

  for (const row of rows) {
    const value = selector(row);
    const rank = row.year * 100 + row.month;
    if (value > bestValue || (value === bestValue && rank > bestRank)) {
      bestRow = row;
      bestValue = value;
      bestRank = rank;
    }
  }

  if (!bestRow) {
    return null;
  }
  return {
    month: ym(bestRow),
    days: bestValue,
  };
}

function toKm(m: number | null | undefined) {
  if (m == null) return null;
  return m / 1000;
}

type ChartPoint = {
  month: string;
  value: number;
};

type MonthlySortKey = "month" | "windPeak" | "visibility" | "ceiling" | "ts" | "sn";

function monthLabel(value: number) {
  return String(value).padStart(2, "0");
}

function toVisibilityKmForChart(value: number) {
  // trend visibility는 meter 단위라고 가정하고 km로 변환.
  // 추후 단위 스펙이 고정되면 이 변환 규칙을 API 스펙 기준으로 정리.
  return value / 1000;
}

function formatTrendMonthLabel(item: { year: number | null; month: number }) {
  const mm = monthLabel(item.month);
  if (item.year != null) {
    return `${item.year}-${mm}`;
  }
  return mm;
}

function toTrendChartSeries(
  monthly: Array<{ year: number | null; month: number; value: number }>,
  options?: { valueTransform?: (value: number) => number }
) {
  return [...monthly]
    .sort((a, b) => {
      const yearA = a.year ?? 0;
      const yearB = b.year ?? 0;
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      return a.month - b.month;
    })
    .map((item) => {
      const transformed = options?.valueTransform ? options.valueTransform(item.value) : item.value;
      return {
        month: formatTrendMonthLabel(item),
        value: Number(transformed.toFixed(1)),
      };
    });
}

function formatTrendTick(label: string, count: number) {
  if (count < 36) {
    return label;
  }
  if (label.includes("-")) {
    return label.endsWith("-01") ? label.slice(0, 4) : "";
  }
  return label;
}

export default function ReportPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const icao = (params.icao ?? "RKSI").toUpperCase();

  // URL 파라미터가 YYYY-MM-DD로 올 수도 있으니 기본값은 date-only로 유지
  const from = searchParams.get("from") ?? "2023-01-01";
  const to = searchParams.get("to") ?? "2024-01-01";
  const displayFrom = toDateOnly(from);
  const displayTo = toInclusiveEndDate(to);
  const periodText = `${displayFrom} ~ ${displayTo}`;
  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<"1y" | "3y" | "5y" | "all" | null>(null);
  const [monthlyView, setMonthlyView] = useState<"recent12" | "all">("recent12");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<MonthlySortKey>("month");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const initialPeriodRef = useRef({ from, to });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFromDate(from);
    setToDate(to);
    initialPeriodRef.current = { from, to };
    setSelectedPreset(null);
  }, [from, to]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const prepared = getReportMock(icao);
  const report = prepared ?? buildFallbackReport(icao);

  // ✅ 실데이터 쿼리 1) KPI
  const avgQuery = useQuery({
    queryKey: ["metar-average-metrics", icao, from, to],
    queryFn: () => fetchAverageMetrics({ icao, from, to }),
  });

  // ✅ 실데이터 쿼리 2) 월별 관측일수(조건별)
  const monthlyQuery = useQuery({
    queryKey: ["metar-observation", icao, from, to, OBS],
    queryFn: () =>
      fetchMonthlyObservationCounts({
        icao,
        from,
        to,
        windPeak: OBS.windPeak,
        visibility: OBS.visibility,
        ceiling: OBS.ceiling,
        phenomenon: OBS.phenomenon,
        descriptor: OBS.descriptor,
      }),
  });
  const trendWindField = "windspeed" as const;
  // NOTE: 환경에 따라 시정 field가 다르면(예: visibilitym) 여기만 교체
  const trendVisibilityField = "visibility" as const;
  const trendGroupBy = "YEAR_MONTH" as const;

  const windTrendQuery = useQuery({
    queryKey: ["trend-average", icao, trendWindField, from, to, trendGroupBy],
    queryFn: () =>
      fetchMonthlyAverage({
        icao,
        field: trendWindField,
        from,
        to,
        groupBy: trendGroupBy,
      }),
  });

  const visibilityTrendQuery = useQuery({
    queryKey: ["trend-average", icao, trendVisibilityField, from, to, trendGroupBy],
    queryFn: () =>
      fetchMonthlyAverage({
        icao,
        field: trendVisibilityField,
        from,
        to,
        groupBy: trendGroupBy,
      }),
  });

  const avg = avgQuery.data;
  const monthly: MonthlyObservationCounts[] = monthlyQuery.data?.monthly ?? [];
  const sortedMonthly = useMemo(
    () =>
      [...monthly].sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.month - b.month;
      }),
    [monthly]
  );
  const displayedMonthly = useMemo(() => {
    if (monthlyView === "all") {
      return sortedMonthly;
    }
    if (sortedMonthly.length <= 12) {
      return sortedMonthly;
    }
    return sortedMonthly.slice(-12);
  }, [monthlyView, sortedMonthly]);
  const sortedDisplayedMonthly = useMemo(() => {
    const rows = [...displayedMonthly];
    const direction = sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      if (sortKey === "month") {
        return ym(a).localeCompare(ym(b)) * direction;
      }
      const aValue =
        sortKey === "windPeak"
          ? a.windPeakCount
          : sortKey === "visibility"
            ? a.visibilityCount
            : sortKey === "ceiling"
              ? a.ceilingCount
              : sortKey === "ts"
                ? a.phenomenonCount
                : a.descriptorCount;
      const bValue =
        sortKey === "windPeak"
          ? b.windPeakCount
          : sortKey === "visibility"
            ? b.visibilityCount
            : sortKey === "ceiling"
              ? b.ceilingCount
              : sortKey === "ts"
                ? b.phenomenonCount
                : b.descriptorCount;
      return (aValue - bValue) * direction;
    });
    return rows;
  }, [displayedMonthly, sortDir, sortKey]);
  const visibilityPeak = pickPeakMonth(monthly, (row) => row.visibilityCount);
  const windPeak = pickPeakMonth(monthly, (row) => row.windPeakCount);
  const hasAnyMonthlyEvent = monthly.some(
    (row) =>
      row.windPeakCount > 0 ||
      row.visibilityCount > 0 ||
      row.ceilingCount > 0 ||
      row.phenomenonCount > 0 ||
      row.descriptorCount > 0
  );
  const windTrendMonthly = windTrendQuery.data?.monthly ?? [];
  const visibilityTrendMonthly = visibilityTrendQuery.data?.monthly ?? [];

  // KPI (실데이터 우선, 없으면 mock)
  const sampleCount = avg?.totalCount ?? report.sampleCount;
  const avgVisibilityKm =
    toKm(avg?.avgVisibilityM) ?? report.avgVisibilityKm;
  const avgCeilingFt = avg?.avgCeilingFt ?? report.avgCeilingFt;
  const avgWindSpeedKt = avg?.avgWindSpeedKt ?? report.avgWindSpeedKt;
  const summaryAvgVisibilityKm = toKm(avg?.avgVisibilityM);
  const summaryAvgWindSpeedKt = avg?.avgWindSpeedKt ?? null;

  const kpiItems = [
    { label: "표본수", value: `${sampleCount.toLocaleString()} 건` },
    { label: "평균시정", value: `${avgVisibilityKm.toFixed(1)} km` },
    { label: "평균운고", value: `${Math.round(avgCeilingFt).toLocaleString()} ft` },
    { label: "평균풍속", value: `${avgWindSpeedKt.toFixed(1)} kt` },
  ];

  useSeo({
    title: `${icao} 보고서`,
    description: `${icao} 공항의 공개 기상 통계 분석 보고서 페이지입니다.`,
  });

  const coverageFromDate = avg?.coverageFrom ? avg.coverageFrom.slice(0, 10) : null;
  const coverageToDate = avg?.coverageTo ? avg.coverageTo.slice(0, 10) : null;
  const coverageText =
    coverageFromDate && coverageToDate
      ? `${coverageFromDate} ~ ${coverageToDate}`
      : null;
  const presetBaseEndInclusive = minDateOnly(todayUtcDateOnly(), DATA_MAX_INCLUSIVE);
  const presetBaseToExclusive = addDaysUtc(presetBaseEndInclusive, 1);
  const summaryVisibilityText = summaryAvgVisibilityKm == null ? "-" : `${summaryAvgVisibilityKm.toFixed(1)} km`;
  const summaryWindText = summaryAvgWindSpeedKt == null ? "-" : `${summaryAvgWindSpeedKt.toFixed(1)} kt`;
  const peakSummaryText =
    hasAnyMonthlyEvent && visibilityPeak && windPeak
      ? ` 저시정(≤${OBS.visibility}m)은 ${visibilityPeak.month}에 ${visibilityPeak.days}일로 최다, 강풍(피크≥${OBS.windPeak}kt)은 ${windPeak.month}에 ${windPeak.days}일로 최다입니다.`
      : "";
  const coverageSummaryText =
    coverageFromDate && coverageToDate
      ? ` 데이터 커버리지는 ${coverageFromDate}~${coverageToDate}입니다.`
      : "";
  const autoSummaryText = `선택 기간(포함) 기준, 평균 시정은 ${summaryVisibilityText}, 평균 풍속은 ${summaryWindText}입니다.${peakSummaryText}${coverageSummaryText}`;
  const periodInvalid = Boolean(fromDate && toDate && fromDate >= toDate);
  const canApply = Boolean(fromDate && toDate && !periodInvalid);
  const generatedWindSeries: ChartPoint[] = windTrendMonthly.length
    ? toTrendChartSeries(windTrendMonthly)
    : report.windSeries;
  const generatedVisSeries: ChartPoint[] = visibilityTrendMonthly.length
    ? toTrendChartSeries(visibilityTrendMonthly, { valueTransform: toVisibilityKmForChart })
    : report.visSeries;

  const handlePeriodApply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canApply) {
      return;
    }
    const next = new URLSearchParams();
    next.set("from", fromDate);
    next.set("to", toDate);
    navigate(`/report/${icao}?${next.toString()}`);
  };

  const applyRecentPreset = (years: 1 | 3 | 5) => {
    const startInclusive = addDaysUtc(addYearsUtc(presetBaseEndInclusive, -years), 1);
    const endExclusive = presetBaseToExclusive;
    setFromDate(startInclusive);
    setToDate(endExclusive);
    setSelectedPreset(`${years}y` as "1y" | "3y" | "5y");
  };

  const applyAllPreset = () => {
    setFromDate(DATA_MIN);
    setToDate(addDaysUtc(DATA_MAX_INCLUSIVE, 1));
    setSelectedPreset("all");
  };

  const handleResetPeriod = () => {
    setFromDate(initialPeriodRef.current.from);
    setToDate(initialPeriodRef.current.to);
    setSelectedPreset(null);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("링크가 복사되었습니다.");
    } catch {
      showToast("복사에 실패했습니다. 주소를 직접 복사해주세요.");
    }
  };

  const handleMonthlySort = (key: MonthlySortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  };

  const renderSortIcon = (key: MonthlySortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-slate-700" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-slate-700" />
    );
  };

  return (
    <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-700">
            홈
          </Link>
          <span>/</span>
          <span>리포트</span>
          <span>/</span>
          <span className="font-semibold text-slate-700">{icao}</span>
        </nav>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          공항별 기상 통계 분석 보고서
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          ICAO: <span className="font-semibold text-slate-800">{icao}</span>
          <span className="mx-2">|</span>
          기간(포함): <span className="font-semibold text-slate-800">{periodText}</span>
          <button
            type="button"
            onClick={() => setIsPeriodOpen((prev) => !prev)}
            className="ml-3 rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            기간 변경
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="ml-2 rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            링크 복사
          </button>
        </p>

        {coverageText && (
          <p className="mt-1 text-sm text-slate-600">
            데이터 커버리지(포함):{" "}
            <span className="font-semibold text-slate-800">{coverageText}</span>
          </p>
        )}

        {isPeriodOpen && (
          <form
            onSubmit={handlePeriodApply}
            className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyRecentPreset(1)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  selectedPreset === "1y" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                최근 1년
              </button>
              <button
                type="button"
                onClick={() => applyRecentPreset(3)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  selectedPreset === "3y" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                최근 3년
              </button>
              <button
                type="button"
                onClick={() => applyRecentPreset(5)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  selectedPreset === "5y" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                최근 5년
              </button>
              <button
                type="button"
                onClick={applyAllPreset}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  selectedPreset === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                전체
              </button>
              <button
                type="button"
                onClick={handleResetPeriod}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="grid gap-1 text-sm text-slate-700">
                <span className="text-xs text-slate-500">From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setFromDate(event.target.value);
                    setSelectedPreset(null);
                  }}
                  className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                />
              </label>
              <label className="grid gap-1 text-sm text-slate-700">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  To
                  <span title="종료일(To)은 포함되지 않으며, 실제 조회는 To 이전까지 집계됩니다.">
                    <Info className="h-3.5 w-3.5 text-slate-400 transition-colors hover:text-slate-600" />
                  </span>
                </span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setToDate(event.target.value);
                    setSelectedPreset(null);
                  }}
                  className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                />
              </label>
              <button
                type="submit"
                disabled={!canApply}
                className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                적용
              </button>
            </div>
            {periodInvalid && (
              <p className="mt-2 text-xs text-amber-700">기간을 다시 확인해주세요</p>
            )}
          </form>
        )}

        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-700">{autoSummaryText}</p>

        {(avgQuery.isLoading || monthlyQuery.isLoading) && (
          <p className="mt-4 text-sm text-slate-500">실데이터를 불러오는 중...</p>
        )}

        {(avgQuery.isError || monthlyQuery.isError) && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            실데이터 조회에 실패해 예시 데이터로 표시될 수 있습니다.
          </p>
        )}
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">관측 현황</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpiItems.map((kpi) => (
            <article
              key={kpi.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-none"
            >
              <p className="text-xs text-slate-500">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 차트: 실데이터 우선, 로딩/에러 시 mock fallback */}
      <section className="grid grid-cols-1 gap-4">
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">평균 풍속 시계열</h2>
          <p className="mt-1 text-sm text-slate-500">Monthly Average (selected period)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generatedWindSeries}>
                <defs>
                  <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  interval="preserveStartEnd"
                  minTickGap={26}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(value) => formatTrendTick(String(value), generatedWindSeries.length)}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  labelFormatter={(label) => String(label)}
                  formatter={(value) => [`${Number(value).toFixed(1)} kt`, "풍속"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#windGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">평균 시정 시계열</h2>
          <p className="mt-1 text-sm text-slate-500">Monthly Average (selected period)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generatedVisSeries}>
                <defs>
                  <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  interval="preserveStartEnd"
                  minTickGap={26}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(value) => formatTrendTick(String(value), generatedVisSeries.length)}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  labelFormatter={(label) => String(label)}
                  formatter={(value) => [`${Number(value).toFixed(1)} km`, "시정"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#visGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
      <p className="mt-3 text-sm text-slate-500">
        참고: 월별 평균은 ‘평시 상태’를 요약합니다. 운항 영향은 아래 ‘임계값 초과 일수’ 지표가 더 직접적입니다.
      </p>

      {/* ✅ 실데이터 테이블 */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">월별 관측 일수</h2>
        <p className="mt-1 text-sm tracking-tight text-slate-600">
          집계 조건:
          <span className="ml-1">
            강풍(피크) ≥ <span className="font-medium text-slate-700">{OBS.windPeak} kt</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            저시정 ≤ <span className="font-medium text-slate-700">{OBS.visibility} m</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            저운고 ≤ <span className="font-medium text-slate-700">{OBS.ceiling} ft</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            {OBS.phenomenon}
            <span className="text-slate-500">(뇌전)</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            {OBS.descriptor}
            <span className="text-slate-500">(눈)</span>
          </span>
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMonthlyView("recent12")}
              className={`rounded-lg px-3 py-1 text-sm transition ${
                monthlyView === "recent12" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"
              }`}
            >
              최근 12개월
            </button>
            <button
              type="button"
              onClick={() => setMonthlyView("all")}
              className={`rounded-lg px-3 py-1 text-sm transition ${
                monthlyView === "all" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"
              }`}
            >
              전체
            </button>
          </div>
          <p className="text-sm text-slate-500">
            {monthlyView === "recent12"
              ? `표시: 최근 12개월(${displayedMonthly.length}/${sortedMonthly.length})`
              : `표시: 전체(${displayedMonthly.length})`}
          </p>
        </div>
        {hasAnyMonthlyEvent && visibilityPeak && windPeak && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
              저시정(≤{OBS.visibility}m) 최다: {visibilityPeak.month} · {visibilityPeak.days}일
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
              강풍(피크≥{OBS.windPeak}kt) 최다: {windPeak.month} · {windPeak.days}일
            </span>
          </div>
        )}
        {!hasAnyMonthlyEvent && (
          <div className="mt-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              해당 조건에서 이벤트가 없습니다
            </span>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-slate-600">
                <th className="w-[132px] px-3 py-2 text-left font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("month")}
                    className="inline-flex items-center gap-1 text-sm text-slate-700"
                  >
                    <span>Month</span>
                    {renderSortIcon("month")}
                  </button>
                  <span className="block text-xs text-slate-500">(YYYY-MM)</span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("windPeak")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Wind className="h-3.5 w-3.5 text-slate-400" />
                    <span>WindPeak</span>
                    {renderSortIcon("windPeak")}
                  </button>
                  <span className="block text-xs text-slate-500">(≥ {OBS.windPeak} kt)</span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("visibility")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    <span>Visibility</span>
                    {renderSortIcon("visibility")}
                  </button>
                  <span className="block text-xs text-slate-500">(≤ {OBS.visibility} m)</span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("ceiling")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Cloud className="h-3.5 w-3.5 text-slate-400" />
                    <span>Ceiling</span>
                    {renderSortIcon("ceiling")}
                  </button>
                  <span className="block text-xs text-slate-500">(≤ {OBS.ceiling} ft)</span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("ts")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Zap className="h-3.5 w-3.5 text-slate-400" />
                    <span>Thunderstorm</span>
                    {renderSortIcon("ts")}
                  </button>
                  <span className="block text-xs text-slate-500">({OBS.phenomenon})</span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("sn")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Snowflake className="h-3.5 w-3.5 text-slate-400" />
                    <span>Snow</span>
                    {renderSortIcon("sn")}
                  </button>
                  <span className="block text-xs text-slate-500">({OBS.descriptor})</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {sortedDisplayedMonthly.map((row) => (
                <tr
                  key={ym(row)}
                  className="odd:bg-white even:bg-slate-50/60 text-slate-700 transition-colors hover:bg-slate-100/60"
                >
                  <td className="px-3 py-2 text-left">{ym(row)}</td>
                  <td className="px-3 py-2 text-center">{row.windPeakCount}</td>
                  <td className="px-3 py-2 text-center">{row.visibilityCount}</td>
                  <td className="px-3 py-2 text-center">{row.ceilingCount}</td>
                  <td className="px-3 py-2 text-center">{row.phenomenonCount}</td>
                  <td className="px-3 py-2 text-center">{row.descriptorCount}</td>
                </tr>
              ))}
              {!sortedDisplayedMonthly.length && (
                <tr className="text-slate-700">
                  <td className="px-3 py-6" colSpan={6}>
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-amber-900">면책 안내</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          {report.disclaimer}
        </p>
      </section>

      {toastMessage && (
        <div
          aria-live="polite"
          role="status"
          className="fixed bottom-4 right-4 z-50 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </PageContainer>
  );
}
