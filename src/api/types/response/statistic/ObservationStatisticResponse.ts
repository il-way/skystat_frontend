import type { HourlyCount } from "../common/HourlyCount";
import type { MonthlyCount } from "../common/MonthlyCount";

export type ObservationStatisticResponse = {
  coverageFrom: string;
  coverageTo: string;
  totalCount: number;
  monthlyData: MonthlyCount[]
  hourlyData: HourlyCount[]
};