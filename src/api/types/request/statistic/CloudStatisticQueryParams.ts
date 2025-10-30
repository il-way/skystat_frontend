import type { CloudCondition } from "../common/Condition";

export type CloudStatisticQueryParams = {
  icao: string;
  condition: CloudCondition;
  target: string;
  startISO: string;
  endISO: string;
}