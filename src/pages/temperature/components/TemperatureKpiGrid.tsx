import { round2 } from "@/lib/math";
import KpiCard from "../../../components/kpi/KpiCard";
import type { TemperaturedKpiValues } from "@/pages/temperature/types/TemperaturedKpiValues";
import { dataCoverageHint } from "@/lib/page";
import { useTranslation } from "react-i18next";

export function TemperatureKpiGrid({ kpis }: { kpis: TemperaturedKpiValues }) {
  const { t } = useTranslation();
  const { coverageFrom, coverageTo, sampleSize, annualMean, annualMax, annualMin, isFetched, hasData } = kpis;
  const rawCoverageHint = dataCoverageHint(coverageFrom, coverageTo, isFetched, hasData);
  const coverageHint =
    rawCoverageHint === "Not Searched"
      ? t("analysis.kpi.notSearched")
      : rawCoverageHint === "No Data"
      ? t("trail.noData")
      : rawCoverageHint;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{t("analysis.kpi.sectionTitle")}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title={t("analysis.kpi.sampleSize")} value={sampleSize.toString()} hint={coverageHint} />
        <KpiCard title={t("analysis.temperature.kpi.annualMean")} value={round2(annualMean)!.toString()} hint={t("analysis.temperature.kpi.temperatureUnitHint")} />
        <KpiCard title={t("analysis.temperature.kpi.maxTemp")} value={annualMax.toString()} hint={t("analysis.temperature.kpi.temperatureUnitHint")} />
        <KpiCard title={t("analysis.temperature.kpi.minTemp")} value={annualMin.toString()} hint={t("analysis.temperature.kpi.temperatureUnitHint")} />
      </div>
    </section>
  );
}
