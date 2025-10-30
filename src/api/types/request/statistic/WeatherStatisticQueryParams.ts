import type { WeatherPhenomenon } from "@/pages/weather/types/WeatherPhenomenon";
import type { WeatherCondition } from "../common/Condition";
import type { WeatherDescriptor } from "@/pages/weather/types/WeatherDescriptor";

export type WeatherStatisticQueryParams = {
  icao: string;
  condition: WeatherCondition;
  list: (WeatherDescriptor | WeatherPhenomenon)[];
  startISO: string;
  endISO: string;
}