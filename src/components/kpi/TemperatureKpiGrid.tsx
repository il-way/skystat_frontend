import { round2 } from "@/lib/temperature";
import KpiCard from "./KpiCard";
import type { TemperaturedKpiValues } from "@/types/components/kpi/ThresholdKpiValues";

export function TemperatureKpiGrid({ kpis }: { kpis: TemperaturedKpiValues }) {
  const { years, sampleSize, annualMean, annualMax, annualMin } = kpis;
  years.sort((a,b) => a-b);
  const coverageHint = `${years[0]} ~ ${years[years.length-1]}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Sample Size" value={sampleSize.toString()} hint={`METAR (${coverageHint})`} />
      <KpiCard title="Annual Mean" value={round2(annualMean).toString()} hint="temperature [℃]" />
      <KpiCard title="Observed Max" value={annualMax.toString()} hint="temperature [℃]" />
      <KpiCard title="Observed Min" value={annualMin.toString()} hint="temperature [℃]" />
    </div>
  )
}