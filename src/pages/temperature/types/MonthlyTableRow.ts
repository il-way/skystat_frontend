import type { MonthShortName } from "@/types/dates/Dates";

export type MonthlyTableRow = {
  month: number;
  monthShotrName: MonthShortName;
  mean: number | null;
  meanMax: number | null;
  meanMin: number | null;
  monthlyMax: number | null;
  monthlyMin: number | null;
}