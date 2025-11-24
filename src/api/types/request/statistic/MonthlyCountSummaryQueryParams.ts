import type { WeatherDescriptor } from "@/pages/weather/types/WeatherDescriptor";
import type { WeatherPhenomenon } from "@/pages/weather/types/WeatherPhenomenon";

export type MonthlyCountSummaryQueryParams = {
  icao: string;
  startISO: string;
  endISO: string;
  windPeakThreshold: number;
  visibilityThreshold: number;
  ceilingThreshold: number;
  phenomenon: WeatherPhenomenon;
  descriptor: WeatherDescriptor;
}