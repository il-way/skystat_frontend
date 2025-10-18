import type { WeatherPhenomenon } from "@/types/weather/WeatherPhenomenon";
import type { WeatherCondition } from "../common/Condition";
import type { WeatherDescriptor } from "@/types/weather/WeatherDescriptor";

export type WeatherStatisticQueryParams = {
  icao: string;
  condition: WeatherCondition;
  list: (WeatherDescriptor | WeatherPhenomenon)[];
  startISO: string;
  endISO: string;
}