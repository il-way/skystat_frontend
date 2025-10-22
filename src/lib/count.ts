import type { ObservationStatisticResponse } from "@/types/api/response/statistic/ObservationStatisticResponse";
import { monthShortNames } from "./date";
import type { MonthlyCount } from "@/types/api/response/common/MonthlyCount";
import type { HourlyCount } from "@/types/api/response/common/HourlyCount";

export function groupMonthly(resp?: ObservationStatisticResponse) {
  const rows = (resp?.monthlyData ?? []) as MonthlyCount[];
  // { 2019: [1월엔 12일 관측, 2월엔 13일 관측, ...] }
  const byYear = new Map<number, number[]>();
  for (const r of rows) {
    if (!byYear.has(r.year)) byYear.set(r.year, Array(12).fill(0));
    byYear.get(r.year)![r.month-1] += r.count;
  }
  const years = Array.from(byYear.keys()).sort((a,b) => a-b);
  const total = Array(12).fill(0);
  years.forEach(y => byYear.get(y)!.forEach((count, monthIdx) => total[monthIdx]+=count));

  const toSeries = (arr: number[]) => [...monthShortNames].map((m, i) => ({ m, count: arr[i] || 0}));

  return {
    years,
    byYear,
    totalSeries: toSeries(total),
    seriesOf: (year:number)=> toSeries(byYear.get(year) ?? Array(12).fill(0))
  };

}

export function groupHourly(resp?: ObservationStatisticResponse) {
  const rows = (resp?.hourlyData ?? []) as HourlyCount[];
  // { 2019년 : { 1월: [1시관측, 2시관측, 3시관측, ...], 2월: [...], ... } }
  const store = new Map<number, Map<number, number[]>>();
  for (const r of rows) {
    if (!store.has(r.year)) store.set(r.year, new Map());
    const monthMap = store.get(r.year)!;
    if (!monthMap.has(r.month)) monthMap.set(r.month, Array(24).fill(0));
    monthMap.get(r.month)![r.hour] += r.count;
  }

  const years = Array.from(store.keys()).sort((a,b) => a-b);
  const by = (year: number, month: number) => (
    store.get(year)?.get(month)
    ?? Array(24).fill(0)
  ).map((count, hour) => (
    { hour: hour.toString().padStart(2, "0"), count})
  );

  const totalOf = (month:number) => {
    const acc = Array(24).fill(0);
    years.forEach(y => (
      store.get(y)?.get(month) 
      ?? Array(24).fill(0)
    ).forEach((count, hour)=> acc[hour]+=count));
    return acc.map((count,hour)=>({ hour: hour.toString().padStart(2,"0"), count }));
  };

  return { years, by, totalOf };
}