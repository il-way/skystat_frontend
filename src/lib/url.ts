import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import type { CloudStatisticQueryParams } from "@/types/api/request/statistic/CloudStatisticQueryParams";
import type { TemperatureStatisticQueryParams } from "@/types/api/request/statistic/TemperatureStatisticQueryParams";
import type { ThresholdStatisticQueryParams } from "@/types/api/request/statistic/ThresholdStatisticQueryParams";
import type { WeatherStatisticQueryParams } from "@/types/api/request/statistic/WeatherStatisticQueryParams";
import type { WindRoseQueryParams } from "@/types/api/request/statistic/WindRoseQueryParams";

export function buildThresholdURL(params: ThresholdStatisticQueryParams): URL {
  const { icao } = params;
  const url = new URL(`/metar/statistic/threshold/${encodeURIComponent(icao)}`);
  url.searchParams.set("field", params.field);
  url.searchParams.set("comparison", params.comparison);
  url.searchParams.set("threshold", String(params.threshold));
  url.searchParams.set("unit", params.unit);
  url.searchParams.set("startDateTime", params.startISO);
  url.searchParams.set("endDateTime", params.endISO);
  return url;
}

export function buildWeatherURL(params: WeatherStatisticQueryParams): URL {
  const { icao } = params;
  const url = new URL(`/metar/statistic/weather/${encodeURIComponent(icao)}`);
  url.searchParams.set("condition", params.condition);
  (params.list || []).forEach((v) => url.searchParams.append("list", v));
  url.searchParams.set("startDateTime", params.startISO);
  url.searchParams.set("endDateTime", params.endISO);
  return url;
}

export function buildCloudURL(params: CloudStatisticQueryParams): URL {
  const { icao } = params;
  const url = new URL(`/metar/statistic/cloud/${encodeURIComponent(icao)}`);
  url.searchParams.set("condition", params.condition);
  url.searchParams.set("target", params.target);
  url.searchParams.set("startDateTime", params.startISO);
  url.searchParams.set("endDateTime", params.endISO);
  return url;
}

export function buildTemperatureURL(params: TemperatureStatisticQueryParams): URL {
  const { icao } = params;
  const url = new URL(
    `/metar/statistic/temperature/${encodeURIComponent(icao)}`
  );
  url.searchParams.set("startYear", params.startYear);
  url.searchParams.set("endYear", params.endYear);
  return url;
}

export function buildWindRoseURL(params: WindRoseQueryParams): URL {
  const { icao } = params;
  const url = new URL(`/metar/windrose/${encodeURIComponent(icao)}`);
  url.searchParams.set("startDateTime", params.startISO);
  url.searchParams.set("endDateTime", params.endISO);
  return url;
}

export function buildMetarInventoryURL(icao: string): URL {
  const url = new URL(`/metar/inventory/${encodeURIComponent(icao)}`);
  return url;
}

export function buildAverageSummaryURL(params: BasicQueryParams): URL {
  const { icao } = params;
  const url = new URL(`/metar/inventory/${encodeURIComponent(icao)}`);
  url.searchParams.set("startDateTime", params.startISO);
  url.searchParams.set("endDateTime", params.endISO);
  return url;
}
