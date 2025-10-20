import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import type { CloudStatisticQueryParams } from "@/types/api/request/statistic/CloudStatisticQueryParams";
import type { TemperatureStatisticQueryParams } from "@/types/api/request/statistic/TemperatureStatisticQueryParams";
import type { ThresholdStatisticQueryParams } from "@/types/api/request/statistic/ThresholdStatisticQueryParams";
import type { WeatherStatisticQueryParams } from "@/types/api/request/statistic/WeatherStatisticQueryParams";

export function buildThresholdURL(params: ThresholdStatisticQueryParams): string {
  const { icao, field, comparison, unit, startISO, endISO } = params;
  const path = `/metar/statistic/threshold/${encodeURIComponent(icao)}`;
  const queryString = new URLSearchParams({
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
  const path = `/metar/statistic/weather/${encodeURIComponent(icao)}`;
  const queryString = new URLSearchParams({
    condition,
    startDateTime: startISO,
    endDateTime: endISO,
  });
  (list || []).forEach((v) => queryString.append("list", v));
  return `${path}?${queryString}`;
}

export function buildCloudURL(params: CloudStatisticQueryParams): string {
  const { icao, condition, target, startISO, endISO } = params;
  const path = `/metar/statistic/cloud/${encodeURIComponent(icao)}`;
  const queryString = new URLSearchParams({
    condition,
    target,
    startDateTime: startISO,
    endDateTime: endISO,
  });
  return `${path}?${queryString}`;
}

export function buildTemperatureURL(params: TemperatureStatisticQueryParams): string {
  const { icao, startYear, endYear } = params;
  const path =`/metar/statistic/temperature/${encodeURIComponent(icao)}`;
  const queryString = new URLSearchParams({
    startYear,
    endYear,
  });
  return `${path}?${queryString}`;
}

export function buildWindRoseURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  const path = `/metar/windrose/${encodeURIComponent(icao)}`;
  const queryString = new URLSearchParams({
    startDateTime: startISO,
    endDateTime: endISO,
  });
  
  return `${path}?${queryString}`;
}

export function buildMetarInventoryURL(icao: string): string {
  return `/metar/inventory/${encodeURIComponent(icao)}`;
}

export function buildAverageSummaryURL(params: BasicQueryParams): string {
  const { icao, startISO, endISO } = params;
  const path = `/metar/average/summary/${encodeURIComponent(icao)}`;
  const queryString = new URLSearchParams({
    startDateTime: startISO,
    endDateTime: endISO,
  });
  
  return `${path}?${queryString}`;
}
