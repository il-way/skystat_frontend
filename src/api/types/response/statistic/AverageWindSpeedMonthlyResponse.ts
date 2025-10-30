import type { MonthlyAverage } from "../common/MonthlyAverage";

export type AverageWindSpeedMonthlyResponse = {
  coverageFrom: string;
  coverageTo: string;
  totalCount: number;
  monthly: MonthlyAverage[];
};

