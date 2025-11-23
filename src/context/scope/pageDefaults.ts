import { toUTCInput } from "@/lib/date";
import type { ScopeState } from "./Scope";

export type PageId = 
  | "dashboard"
  | "altimeter"
  | "visibility"
  | "weather"
  | "wind"
  | "temperature"
  | "windrose";

const from2019 = toUTCInput(Date.UTC(2019, 0, 1, 0, 0));
const to2023 = toUTCInput(Date.UTC(2023, 0, 1, 0, 0));

export type ThresholdLimit = {
  use: boolean,
  min: number,
  max: number
};

export const PAGE_ID_THRESHOLD: Record<PageId, ThresholdLimit> = {
  "dashboard": { use: false, min: -1, max: -1 },
  "altimeter": { use: true, min: 900, max: 1099 },
  "visibility": { use: true, min: 0, max: 9999 },
  "weather": { use: true, min: -1, max: -1 },
  "wind": { use: true, min: 0, max: 99 },
  "temperature": { use: false, min: -1, max: -1 },
  "windrose": { use: false, min: -1, max: -1 },
};

export const PAGE_DEFAULTS: Record<PageId, ScopeState> = {
  dashboard:  { icao: "KJFK", from: from2019, to: to2023, threshold: "-1" },
  altimeter:  { icao: "KJFK", from: from2019, to: to2023, threshold: "996" },
  visibility: { icao: "KJFK", from: from2019, to: to2023, threshold: "800" },
  weather:    { icao: "KJFK", from: from2019, to: to2023, threshold: "SN" },
  wind:       { icao: "KJFK", from: from2019, to: to2023, threshold: "35" },
  temperature:{ icao: "KJFK", from: "2019", to: "2023", threshold: "-1" },
  windrose:   { icao: "KJFK", from: "2019", to: "2023", threshold: "-1" },
};