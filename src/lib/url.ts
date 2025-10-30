import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { CloudStatisticQueryParams } from "@/api/types/request/statistic/CloudStatisticQueryParams";
import type { TemperatureStatisticQueryParams } from "@/api/types/request/statistic/TemperatureStatisticQueryParams";
import type { ThresholdStatisticQueryParams } from "@/api/types/request/statistic/ThresholdStatisticQueryParams";
import type { WeatherStatisticQueryParams } from "@/api/types/request/statistic/WeatherStatisticQueryParams";
import { validatePeriod } from "./date";

export function buildThresholdURL(params: ThresholdStatisticQueryParams): string {
  const { icao, field, comparison, unit, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/statistic/threshold";
  const queryString = new URLSearchParams({
    icao,
    field,
    comparison,
    threshold: params.threshold.toString(),
    unit,
    startDateTime: startISO,
    endDateTime: endISO,
  });
  return `${path}?${queryString}`;
}

export function buildWeatherURL(params: WeatherStatisticQueryParams): string {
  const { icao, condition, list, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/statistic/weather";
  const queryString = new URLSearchParams({
    icao,
    condition,
    startDateTime: startISO,
    endDateTime: endISO,
  });
  (list || []).forEach((v) => queryString.append("list", v));
  return `${path}?${queryString}`;
}

export function buildCloudURL(params: CloudStatisticQueryParams): string {
  const { icao, condition, target, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/statistic/cloud";
  const queryString = new URLSearchParams({
    icao,
    condition,
    target,
    startDateTime: startISO,
    endDateTime: endISO,
  });
  return `${path}?${queryString}`;
}

export function buildTemperatureURL(params: TemperatureStatisticQueryParams): string {
  const { icao, startYear, endYear } = params;
  validatePeriod(startYear, endYear);
  const path ="/metar/statistic/temperature";
  const queryString = new URLSearchParams({
    icao,
    startYear,
    endYear,
  });
  return `${path}?${queryString}`;
}

export function buildWindRoseURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/windrose";
  const queryString = new URLSearchParams({
    icao,
    startDateTime: startISO,
    endDateTime: endISO,
  });
  
  return `${path}?${queryString}`;
}

export function buildMetarInventoryURL(icao: string): string {
  return `/metar/inventory?icao=${encodeURIComponent(icao)}`;
}

export function buildAverageSummaryURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/average/summary";
  const queryString = new URLSearchParams({
    icao,
    startDateTime: startISO,
    endDateTime: endISO,
  });
  
  return `${path}?${queryString}`;
}

export function buildWindSpeedAverageMonthlyURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path ="/metar/average";
  const queryString = new URLSearchParams({
    icao,
    startDateTime: startISO,
    endDateTime: endISO,
    field: "windspeed",
    unit: "kt"
  });
  return `${path}?${queryString}`;
}
