import { monthValues } from "@/lib/date";
import type { DashboardTableRow } from "./types/DashboardTable";

export function emptyDashboardTableRows(): DashboardTableRow[] {
  return monthValues.map(m => ({
    month: m,
    windPeak: 0,
    visibility: 0,
    ceiling: 0,
    thunderStorm: 0,
    snow: 0,
  }));
};