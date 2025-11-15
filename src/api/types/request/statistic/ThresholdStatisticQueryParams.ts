import type { Comparison } from "../common/Comparison";
import type { MetricField } from "../common/MetricField";
import type { Unit } from "../common/Unit";

export type ThresholdStatisticQueryParams = {
  icao: string;
  field: MetricField;
  comparison: Comparison;
  threshold: string;
  unit: Unit;
  startISO: string;
  endISO: string;
}