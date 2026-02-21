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
import { useTranslation } from "react-i18next";

import PageContainer from "../../components/layout/PageContainer";
import AdSlot from "../../components/ads/AdSlot";
import { getReportMock } from "../../lib/reportMock";
import type { ReportMock } from "../../lib/reportMock";
import { useSeo } from "../../lib/seo";

import {
  fetchAverageMetrics,
  fetchMonthlyObservationCounts,
  type MonthlyObservationCounts,
} from "../../api/metarSummayApi";
import { fetchMonthlyAverage } from "../../api/metarTrendApi";

function buildFallbackReport(
  icao: string,
  fallback: {
    airportName: string;
    region: string;
    summary: string;
    disclaimer: string;
  }
): ReportMock {
  return {
    icao,
    airportName: fallback.airportName,
    region: fallback.region,
    period: "2023-01-01 ~ 2024-01-01",
    summary: fallback.summary,
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
    disclaimer: fallback.disclaimer,
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
  const { t, i18n } = useTranslation();
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
  const report = prepared
    ?? buildFallbackReport(icao, {
      airportName: t("reportPage.fallback.airportName"),
      region: t("reportPage.fallback.region"),
      summary: t("reportPage.fallback.summary"),
      disclaimer: t("reportPage.fallback.disclaimer"),
    });

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
    { label: t("reportPage.kpi.sampleSize"), value: `${sampleCount.toLocaleString()} ${t("units.records")}` },
    { label: t("reportPage.kpi.avgVisibility"), value: `${avgVisibilityKm.toFixed(1)} km` },
    { label: t("reportPage.kpi.avgCeiling"), value: `${Math.round(avgCeilingFt).toLocaleString()} ft` },
    { label: t("reportPage.kpi.avgWind"), value: `${avgWindSpeedKt.toFixed(1)} kt` },
  ];

  useSeo({
    title: t("reportPage.seo.title", { icao }),
    description: t("reportPage.seo.description", { icao }),
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
      ? ` ${t("reportPage.summary.peak", {
          visibility: OBS.visibility,
          visMonth: visibilityPeak.month,
          visDays: visibilityPeak.days,
          wind: OBS.windPeak,
          windMonth: windPeak.month,
          windDays: windPeak.days,
        })}`
      : "";
  const coverageSummaryText =
    coverageFromDate && coverageToDate
      ? ` ${t("reportPage.summary.coverage", {
          from: coverageFromDate,
          to: coverageToDate,
        })}`
      : "";
  const autoSummaryText = `${t("reportPage.summary.base", {
    visibility: summaryVisibilityText,
    wind: summaryWindText,
  })}${peakSummaryText}${coverageSummaryText}`;
  const periodInvalid = Boolean(fromDate && toDate && fromDate >= toDate);
  const canApply = Boolean(fromDate && toDate && !periodInvalid);
  const isKo = (i18n.resolvedLanguage || i18n.language || "ko").startsWith("ko");
  const disclaimerText = isKo ? report.disclaimer : t("reportPage.disclaimer.body");
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
      showToast(t("reportPage.toast.copySuccess"));
    } catch {
      showToast(t("reportPage.toast.copyFail"));
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
    <div className="notranslate" translate="no">
      <PageContainer className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-700">
            {t("actions.home")}
          </Link>
          <span>/</span>
          <span>{t("reportPage.breadcrumb.report")}</span>
          <span>/</span>
          <span className="font-semibold text-slate-700">{icao}</span>
        </nav>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {t("reportPage.header.title")}
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          {t("reportPage.header.icaoLabel")}: <span className="font-semibold text-slate-800">{icao}</span>
          <span className="mx-2">|</span>
          {t("reportPage.header.periodInclusive")}: <span className="font-semibold text-slate-800">{periodText}</span>
          <button
            type="button"
            onClick={() => setIsPeriodOpen((prev) => !prev)}
            className="ml-3 rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
          >
            {t("reportPage.header.periodToggle")}
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="ml-2 rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {t("reportPage.header.copyLink")}
          </button>
        </p>

        {coverageText && (
          <p className="mt-1 text-sm text-slate-600">
            {t("reportPage.header.coverageInclusive")}:{" "}
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
                {t("reportPage.header.presets.recent1y")}
              </button>
              <button
                type="button"
                onClick={() => applyRecentPreset(3)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  selectedPreset === "3y" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {t("reportPage.header.presets.recent3y")}
              </button>
              <button
                type="button"
                onClick={() => applyRecentPreset(5)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  selectedPreset === "5y" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {t("reportPage.header.presets.recent5y")}
              </button>
              <button
                type="button"
                onClick={applyAllPreset}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  selectedPreset === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {t("reportPage.header.presets.all")}
              </button>
              <button
                type="button"
                onClick={handleResetPeriod}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {t("reportPage.header.presets.reset")}
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="grid gap-1 text-sm text-slate-700">
                <span className="text-xs text-slate-500">{t("reportPage.header.from")}</span>
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
                  {t("reportPage.header.to")}
                  <span title={t("reportPage.header.toHint")}>
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
                {t("reportPage.header.apply")}
              </button>
            </div>
            {periodInvalid && (
              <p className="mt-2 text-xs text-amber-700">{t("reportPage.header.invalidPeriod")}</p>
            )}
          </form>
        )}

        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-700">{autoSummaryText}</p>

        {(avgQuery.isLoading || monthlyQuery.isLoading) && (
          <p className="mt-4 text-sm text-slate-500">{t("reportPage.header.loading")}</p>
        )}

        {(avgQuery.isError || monthlyQuery.isError) && (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {t("reportPage.header.loadError")}
          </p>
        )}
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">{t("reportPage.kpi.sectionTitle")}</h2>
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
          <h2 className="text-lg font-semibold text-slate-900">{t("reportPage.chart.windTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("reportPage.chart.subtitle")}</p>
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
                  formatter={(value) => [`${Number(value).toFixed(1)} kt`, t("reportPage.chart.windSeries")]}
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
          <h2 className="text-lg font-semibold text-slate-900">{t("reportPage.chart.visibilityTitle")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("reportPage.chart.subtitle")}</p>
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
                  formatter={(value) => [`${Number(value).toFixed(1)} km`, t("reportPage.chart.visibilitySeries")]}
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
        {t("reportPage.chart.note")}
      </p>

      {/* ✅ 실데이터 테이블 */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("reportPage.monthly.title")}</h2>
        <p className="mt-1 text-sm tracking-tight text-slate-600">
          {t("reportPage.monthly.conditionsLabel")}:
          <span className="ml-1">
            {t("reportPage.monthly.strongWind")} ≥ <span className="font-medium text-slate-700">{OBS.windPeak} kt</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            {t("reportPage.monthly.lowVisibility")} ≤ <span className="font-medium text-slate-700">{OBS.visibility} m</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            {t("reportPage.monthly.lowCeiling")} ≤ <span className="font-medium text-slate-700">{OBS.ceiling} ft</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            {OBS.phenomenon}
            <span className="text-slate-500">({t("reportPage.monthly.thunderstormShort")})</span>
          </span>
          <span className="mx-2 text-slate-400">·</span>
          <span>
            {OBS.descriptor}
            <span className="text-slate-500">({t("reportPage.monthly.snowShort")})</span>
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
              {t("reportPage.monthly.recent12")}
            </button>
            <button
              type="button"
              onClick={() => setMonthlyView("all")}
              className={`rounded-lg px-3 py-1 text-sm transition ${
                monthlyView === "all" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"
              }`}
            >
              {t("reportPage.monthly.all")}
            </button>
          </div>
          <p className="text-sm text-slate-500">
            {monthlyView === "recent12"
              ? t("reportPage.monthly.displayRecent", {
                  shown: displayedMonthly.length,
                  total: sortedMonthly.length,
                })
              : t("reportPage.monthly.displayAll", { shown: displayedMonthly.length })}
          </p>
        </div>
        {hasAnyMonthlyEvent && visibilityPeak && windPeak && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
              {t("reportPage.monthly.peakVisibility", {
                threshold: OBS.visibility,
                month: visibilityPeak.month,
                days: visibilityPeak.days,
              })}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
              {t("reportPage.monthly.peakWind", {
                threshold: OBS.windPeak,
                month: windPeak.month,
                days: windPeak.days,
              })}
            </span>
          </div>
        )}
        {!hasAnyMonthlyEvent && (
          <div className="mt-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              {t("reportPage.monthly.noEvent")}
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
                    <span>{t("reportPage.monthly.headers.month")}</span>
                    {renderSortIcon("month")}
                  </button>
                  <span className="block text-xs text-slate-500">{t("reportPage.monthly.headers.monthSub")}</span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("windPeak")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Wind className="h-3.5 w-3.5 text-slate-400" />
                    <span>{t("reportPage.monthly.headers.windPeak")}</span>
                    {renderSortIcon("windPeak")}
                  </button>
                  <span className="block text-xs text-slate-500">
                    {t("reportPage.monthly.headers.windPeakSub", { value: OBS.windPeak })}
                  </span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("visibility")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    <span>{t("reportPage.monthly.headers.visibility")}</span>
                    {renderSortIcon("visibility")}
                  </button>
                  <span className="block text-xs text-slate-500">
                    {t("reportPage.monthly.headers.visibilitySub", { value: OBS.visibility })}
                  </span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("ceiling")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Cloud className="h-3.5 w-3.5 text-slate-400" />
                    <span>{t("reportPage.monthly.headers.ceiling")}</span>
                    {renderSortIcon("ceiling")}
                  </button>
                  <span className="block text-xs text-slate-500">
                    {t("reportPage.monthly.headers.ceilingSub", { value: OBS.ceiling })}
                  </span>
                </th>
                <th className="px-3 py-2 text-center font-semibold">
                  <button
                    type="button"
                    onClick={() => handleMonthlySort("ts")}
                    className="mx-auto flex items-center justify-center gap-1 text-sm text-slate-700"
                  >
                    <Zap className="h-3.5 w-3.5 text-slate-400" />
                    <span>{t("reportPage.monthly.headers.thunderstorm")}</span>
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
                    <span>{t("reportPage.monthly.headers.snow")}</span>
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
                    {t("reportPage.monthly.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot slotKey="report_main" minHeight={300} />

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-amber-900">{t("reportPage.disclaimer.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900/90">
          {disclaimerText}
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
    </div>
  );
}
