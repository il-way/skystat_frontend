import type { ThresholdKpiValues } from "@/pages/threshold/types/ThresholdKpiValues";
import KpiCard from "../../../components/kpi/KpiCard";
import { dataCoverageHint } from "@/lib/page";
import { useTranslation } from "react-i18next";

export function ThresholdKpiCardGrid({ kpis }: { kpis: ThresholdKpiValues }) {
  const { t } = useTranslation();
  const { coverageFrom, coverageTo, sampleSize, totalDaysCount, mostFrequentMonth, mostFrequentHour, isFetched, hasData } = kpis;
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
        <KpiCard title={t("analysis.kpi.observedDays")} value={totalDaysCount.toString()} hint={t("analysis.kpi.daysHint")} />
        <KpiCard title={t("analysis.kpi.mostFrequentMonth")} value={mostFrequentMonth} hint={t("analysis.kpi.monthHint")} />
        <KpiCard
          title={t("analysis.kpi.mostFrequentHour")}
          value={mostFrequentHour}
          hint={t("analysis.kpi.utcAt", { month: mostFrequentMonth.toLocaleLowerCase() })}
        />
      </div>
    </section>
  );
}
