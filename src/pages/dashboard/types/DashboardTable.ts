import type { MonthValue } from "@/types/dates/Dates";

export type DashboardTableRow = {
  month: MonthValue;
  windPeak: number;
  visibility: number;
  ceiling: number;
  thunderStorm: number;
  snow: number;
};