import type { WeatherDescriptor } from "@/pages/weather/types/WeatherDescriptor";
import type { WeatherPhenomenon } from "@/pages/weather/types/WeatherPhenomenon";

export const WEATHER_DESCRIPTORS = new Set<WeatherDescriptor>(["BC","BL","DR","DL","FZ","MI","PR","SH","TS","VC"] as const);

export const WEATHER_PHENOMENA = new Set<WeatherPhenomenon>([
  "DZ","RA","SN","SG","IC","PL","GR","GS","UP",
  "BR","FG","FU","VA","DU","SA","HZ","PY","PO",
  "SQ","FC","SS","DS","WS","NSW",
] as const);

export function isWeatherDescriptor(
  code: string | WeatherDescriptor | WeatherPhenomenon
): code is WeatherDescriptor {
  return WEATHER_DESCRIPTORS.has(code as WeatherDescriptor);
}

export function isWeatherPhenomenon(
  code: string | WeatherDescriptor | WeatherPhenomenon
): code is WeatherPhenomenon {
  return WEATHER_PHENOMENA.has(code as WeatherPhenomenon);
}