import type { MonthValue } from "@/types/dates/Dates";

export type MonthlyCountSummaryResponse = {
  coverageFrom: string;
  coverageTo: string;
  totalCount: number;
  monthly: MonthlyCountSummary[];
};

export type MonthlyCountSummary = {
  year: number,
  month: MonthValue,
  windPeakCount: number,
  visibilityCount: number,
  ceilingCount: number,
  phenomenonCount: number,
  descriptorCount:number,
};