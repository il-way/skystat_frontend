import type { Comparison } from "../common/Comparison";
import type { Unit } from "../common/Unit";

export type ThresholdStatisticQueryParams = {
  icao: string;
  field: string;
  comparison: Comparison;
  threshold: number;
  unit: Unit;
  startISO: string;
  endISO: string;
}