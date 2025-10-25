import type { MonthShortName } from "@/types/dates/Dates";

export type ThresholdKpiValues = {
  sampleSize: number;
  totalDaysCount: number;
  mostFrequentMonth: MonthShortName;
  mostFrequentHour: string;
};