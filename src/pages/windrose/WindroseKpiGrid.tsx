import { dataCoverageHint } from "@/lib/page";
import type { WindroseKpiValues } from "./type/WindroseKpiValues";
import { round2 } from "@/lib/math";
import KpiCard from "@/components/kpi/KpiCard";
import { useTranslation } from "react-i18next";

export function WindroseKpiGrid({ kpis }: { kpis: WindroseKpiValues }) {
  const { t } = useTranslation();
  const { coverageFrom, coverageTo, totalCount, variableSize, speedBins, directionBins, isFetched, hasData } = kpis;
  const rawCoverageHint = dataCoverageHint(coverageFrom, coverageTo, isFetched, hasData);
  const coverageHint =
    rawCoverageHint === "Not Searched"
      ? t("analysis.kpi.notSearched")
      : rawCoverageHint === "No Data"
      ? t("trail.noData")
      : rawCoverageHint;
  const windVariablePercent = totalCount > 0
    ? round2((variableSize / totalCount))! : 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{t("analysis.kpi.sectionTitle")}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title={t("analysis.kpi.sampleSize")} value={totalCount.toString()} hint={coverageHint} />
        <KpiCard title={t("analysis.windrose.kpi.variableRatio")} value={windVariablePercent.toString()} hint="%" />
        <KpiCard title={t("analysis.windrose.kpi.speedBins")} value={speedBins.length.toString()} hint={t("analysis.windrose.kpi.levelsHint")} />
        <KpiCard title={t("analysis.windrose.kpi.directionBins")} value={directionBins.length.toString()} hint={t("analysis.windrose.kpi.cardinalHint")} />
      </div>
    </section>
  );
}
