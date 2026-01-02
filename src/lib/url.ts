import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { CloudStatisticQueryParams } from "@/api/types/request/statistic/CloudStatisticQueryParams";
import type { TemperatureStatisticQueryParams } from "@/api/types/request/statistic/TemperatureStatisticQueryParams";
import type { ThresholdStatisticQueryParams } from "@/api/types/request/statistic/ThresholdStatisticQueryParams";
import type { WeatherStatisticQueryParams } from "@/api/types/request/statistic/WeatherStatisticQueryParams";
import { toUTCInputFrom, utcInputToISO, validatePeriod } from "./date";
import type { MonthlyCountSummaryQueryParams } from "@/api/types/request/statistic/MonthlyCountSummaryQueryParams";

export function buildThresholdURL(params: ThresholdStatisticQueryParams): string {
  const { icao, field, comparison, unit, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/statistics/event/metric";
  const queryString = new URLSearchParams({
    icao,
    field,
    comparison,
    threshold: params.threshold.toString(),
    unit,
    from: startISO,
    to: endISO,
  });
  return `${path}?${queryString}`;
}

export function buildWeatherURL(params: WeatherStatisticQueryParams): string {
  const { icao, condition, list, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/statistics/event/weather";
  const queryString = new URLSearchParams({
    icao,
    condition,
    from: startISO,
    to: endISO,
  });
  (list || []).forEach((v) => queryString.append("list", v));
  return `${path}?${queryString}`;
}

export function buildCloudURL(params: CloudStatisticQueryParams): string {
  const { icao, condition, target, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/statistics/event/cloud";
  const queryString = new URLSearchParams({
    icao,
    condition,
    list: target,
    from: startISO,
    to: endISO,
  });
  return `${path}?${queryString}`;
}

export function buildTemperatureURL(params: TemperatureStatisticQueryParams): string {
  const { icao, startYear, endYear } = params;
  validatePeriod(startYear, endYear);

  const from = utcInputToISO(toUTCInputFrom(startYear));
  const to = utcInputToISO(toUTCInputFrom(endYear));

  const path ="/metar/statistics/trend/temperature";
  const queryString = new URLSearchParams({
    icao,
    from,
    to,
  });
  
  return `${path}?${queryString}`;
}

export function buildWindRoseURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/statistics/trend/windrose";
  const queryString = new URLSearchParams({
    icao,
    from: startISO,
    to: endISO,
  });
  
  return `${path}?${queryString}`;
}

export function buildWindSpeedAverageMonthlyURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path ="/metar/statistics/trend/average";
  const queryString = new URLSearchParams({
    icao,
    field: "windspeed",
    from: startISO,
    to: endISO
  });
  console.log(`${path}?${queryString}`);
  return `${path}?${queryString}`;
}

export function buildMetarInventoryURL(icao: string): string {
  return `/metar/coverage/all?icao=${encodeURIComponent(icao)}`;
}

export function buildMonthlyCountSummaryURL(params: MonthlyCountSummaryQueryParams): string {
  const { icao, startISO, endISO, windPeakThreshold, visibilityThreshold, ceilingThreshold, phenomenon, descriptor } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/summary/observation";
  const queryString = new URLSearchParams({
    icao,
    from: startISO,
    to: endISO,
    windpeak: String(windPeakThreshold) || "30",
    visibility: String(visibilityThreshold) || "800",
    ceiling: String(ceilingThreshold) || "200",
    phenomenon: phenomenon ?? "SN",
    descriptor: descriptor ?? "TS",
  });

  return `${path}?${queryString}`;
}

export function buildAverageSummaryURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  validatePeriod(startISO, endISO);
  const path = "/metar/summary/average/metrics";
  const queryString = new URLSearchParams({
    icao,
    from: startISO,
    to: endISO,
  });
  
  return `${path}?${queryString}`;
}


