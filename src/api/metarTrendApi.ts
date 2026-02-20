import type { MetricField } from "./types/request/common/MetricField";

export type TrendGroupBy = "CALENDAR_MONTH" | "YEAR_MONTH";

export type MonthlyAverageItem = {
  year: number | null;
  month: number;
  value: number;
};

export type MonthlyAverageResponse = {
  coverageFrom: string | null;
  coverageTo: string | null;
  totalCount: number;
  groupBy: string;
  monthly: MonthlyAverageItem[];
};

function toIsoZdt(value: string) {
  if (!value) return value;
  if (value.includes("T")) return value;
  return `${value}T00:00:00Z`;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }
  return res.json();
}

export async function fetchMonthlyAverage(params: {
  icao: string;
  field: MetricField | "visibilitym";
  from: string;
  to: string;
  groupBy: TrendGroupBy;
}): Promise<MonthlyAverageResponse> {
  const qs = new URLSearchParams();
  qs.set("icao", params.icao);
  qs.set("field", params.field);
  qs.set("from", toIsoZdt(params.from));
  qs.set("to", toIsoZdt(params.to));
  qs.set("groupBy", params.groupBy);
  return getJson(`/api/metar/statistics/trend/average?${qs.toString()}`);
}
