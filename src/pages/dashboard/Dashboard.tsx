import { MetarStatisticApi } from "@/api/MetarStatisticApi";
import WindLineChart from "@/pages/dashboard/components/WindLineChart";
import DashboardTable from "@/pages/dashboard/components/DashboardTable";
import { monthShortNameFrom, monthShortNames, utcInputToISO } from "@/lib/date";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { DashboardKpiValues } from "@/pages/dashboard/types/DashboardKpiValues";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { WindLineData } from "./types/WindLineData";
import { Info, Search } from "lucide-react";
import { round2 } from "@/lib/math";
import { getErrorMessage } from "@/lib/page";
import SimpleAlertModal from "@/components/modal/SimpleAlertModal";
import { emptyDashboardTableRows } from "./DashboardHelper";
import PageTrailstatusBar from "@/components/common/PageTrailstatusBar";
import { usePageScope } from "@/context/scope/usePageScope";
import { PAGE_DEFAULTS } from "@/context/scope/pageDefaults";
import { LoadingWrapper } from "@/components/common/LoadingWrapper";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AirportSearchModal from "@/components/modal/AirportSearchModal";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import AdSlot from "@/components/ads/AdSlot";

const DASHBOARD_NAV_ITEMS = [
  { to: "/about", key: "about" },
  { to: "/guide", key: "guide" },
  { to: "/faq", key: "faq" },
  { to: "/terms", key: "terms" },
  { to: "/privacy", key: "privacy" },
  { to: "/contact", key: "contact" },
];

function toDateOnly(value: string) {
  return value.slice(0, 10);
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { icao, from, to, setIcao, setFrom, setTo } = usePageScope({
    pageId: "dashboard",
    defaults: { ...PAGE_DEFAULTS.dashboard },
  });
  const [loading, setLoading] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [errDetails, setErrDetails] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const didAutoFetchRef = useRef(false);

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

  useEffect(() => {
    if (didAutoFetchRef.current) {
      return;
    }
    didAutoFetchRef.current = true;
    void handleFetch();
  }, []);

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
    !avgIsFetched
      ? "preview"
      : avg && avg.totalCount > 0
      ? "summary"
      : avgError === null && tableError === null && avgWindError === null
      ? "no-data"
      : "error";

  const coverageFromDate = kpis.coverageFrom ? toDateOnly(kpis.coverageFrom) : "";
  const coverageToDate = kpis.coverageTo ? toDateOnly(kpis.coverageTo) : "";
  const coverageText =
    coverageFromDate && coverageToDate
      ? `${coverageFromDate} ~ ${coverageToDate}`
      : "";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="lg:hidden" />
              <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
                SkyStat
              </Link>
            </div>

            <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">
              {DASHBOARD_NAV_ITEMS.map((item) => (
                <Link key={item.to} to={item.to} className="hover:text-slate-900">
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link
                to="/"
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {t("actions.home")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="bg-slate-50 pt-20">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="grid min-w-0 w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[auto_180px_1fr_1fr_auto] lg:items-end">
              <div className="flex min-w-0 items-center gap-2 lg:pr-2">
                <SidebarTrigger className="mr-1 hidden lg:inline-flex" />
                <div className="w-full">
                  <label className="mb-1 block text-xs text-slate-600">{t("labels.icao")}</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={icao}
                      readOnly
                      onClick={() => setIsSearchOpen(true)}
                      placeholder={t("labels.airportCode")}
                      className="h-10 rounded-xl border-slate-300 bg-white pl-8 text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="mb-1 block text-xs text-slate-600">{t("labels.from")}</label>
                <Input
                  type="date"
                  value={from.split("T")[0]}
                  onChange={(e) => setFrom(`${e.target.value}T00:00`)}
                  className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200"
                />
              </div>

              <div className="w-full">
                <label className="mb-1 flex items-center gap-1 text-xs text-slate-600">
                  {t("labels.to")}
                  <span title={t("reportPage.header.toHint")}>
                    <Info className="h-3.5 w-3.5 text-slate-400 transition-colors hover:text-slate-600" />
                  </span>
                </label>
                <Input
                  type="date"
                  value={to.split("T")[0]}
                  onChange={(e) => setTo(`${e.target.value}T00:00`)}
                  className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-200"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-1 lg:justify-self-end">
                <Button
                  onClick={handleFetch}
                  disabled={loading || isAnyFetching}
                  className="h-10 w-full rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 lg:w-auto"
                >
                  {loading || isAnyFetching ? t("actions.loadingQuery") : t("actions.search")}
                </Button>
              </div>
            </div>
            {coverageText && (
              <div className="mt-4 text-sm text-slate-600">
                {t("dashboard.coverage")}:{" "}
                <span className="font-semibold text-slate-800">{coverageText}</span>
              </div>
            )}

            <AirportSearchModal
              open={isSearchOpen}
              onOpenChange={setIsSearchOpen}
              currentIcao={icao}
              onSelect={(selectedIcao) => {
                setIcao(selectedIcao);
              }}
            />
          </section>

          {/* Breadcrumb / Context */}
          <PageTrailstatusBar page={t("dashboard.pageName")} status={status} />

          <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-base font-medium text-foreground">{t("dashboard.guide.title")}</h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/guide"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {t("dashboard.guide.guideButton")}
                </Link>
                <Link
                  to="/report/RKSI?from=2023-01-01&to=2024-01-01"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {t("dashboard.guide.sampleButton")}
                </Link>
              </div>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
              <li>{t("dashboard.guide.bullet1")}</li>
              <li>{t("dashboard.guide.bullet2")}</li>
              <li>{t("dashboard.guide.bullet3")}</li>
              <li>{t("dashboard.guide.bullet4")}</li>
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
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t("dashboard.kpi.sectionTitle")}</h2>
            <LoadingWrapper loading={loading || avgIsFetching} className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">{t("dashboard.kpi.sampleSize")}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {kpis.sampleSize.toLocaleString()} {t("units.records")}
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">{t("dashboard.kpi.avgVisibility")}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {(kpis.avgVisibilityM / 1000).toFixed(1)} km
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">{t("dashboard.kpi.avgCeiling")}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {kpis.avgCeilingFt.toLocaleString()} ft
                  </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">{t("dashboard.kpi.avgWind")}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {kpis.avgWindSpeedKt.toLocaleString()} kt
                  </p>
                </article>
              </div>
            </LoadingWrapper>
          </section>

          {/* Chart */}
          <motion.section
            className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-slate-900">{t("dashboard.chart.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("dashboard.chart.subtitle")}</p>
            <LoadingWrapper loading={loading || avgWindIsFetching} className="mt-3">
              <div className="[&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:border-0 [&_[data-slot=card]]:bg-transparent [&_[data-slot=card]]:py-0 [&_[data-slot=card]]:shadow-none [&_[data-slot=card-content]]:px-0 [&_[data-slot=card-content]]:py-0 [&_[data-slot=card-header]]:hidden">
                <WindLineChart data={windLineData} />
              </div>
            </LoadingWrapper>
          </motion.section>

          {/* Table */}
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t("dashboard.table.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("dashboard.table.subtitle")}</p>
            <LoadingWrapper loading={loading || tableIsFetching} className="mt-3">
              <div className="[&_[data-slot=card]]:rounded-none [&_[data-slot=card]]:border-0 [&_[data-slot=card]]:bg-transparent [&_[data-slot=card]]:py-0 [&_[data-slot=card]]:shadow-none [&_[data-slot=card-content]]:px-0 [&_[data-slot=card-content]]:py-0 [&_[data-slot=card-header]]:hidden">
                <DashboardTable rows={tableRows || emptyDashboardTableRows()} />
              </div>
            </LoadingWrapper>
          </section>

          <AdSlot slotKey="dashboard_main" minHeight={280} />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <div className="flex flex-col gap-3 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>SkyStat aviation weather statistics</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to="/about"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {t("footer.about")}
              </Link>
              <Link
                to="/privacy"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {t("footer.contact")}
              </Link>
              <Link
                to="/terms"
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {t("footer.terms")}
              </Link>
            </div>
            <p>&copy; {new Date().getFullYear()} SkyStat</p>
          </div>
        </div>
      </footer>
    </>
  );
}
