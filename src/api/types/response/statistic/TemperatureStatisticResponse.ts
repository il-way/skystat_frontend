import type { HourlyTemperatureStat } from "../common/HourlyTemperatureStat";
import type { MonthlyTemperatureStat } from "../common/MonthlyTemperatureStat";
import type { YearlyTemperatureStat } from "../common/YearlyTemperatureStat";

export type TemperatureStatisticResponse = {
  coverageFrom: string,
  coverageTo: string,
  totalCount: number,
  monthly: MonthlyTemperatureStat[],
  hourly: HourlyTemperatureStat[],
  yearly: YearlyTemperatureStat[],
};