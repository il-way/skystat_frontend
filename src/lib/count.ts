import type { ObservationStatisticResponse } from "@/types/api/response/statistic/ObservationStatisticResponse";
import { monthShortNames } from "./date";
import type { MonthlyCount } from "@/types/api/response/common/MonthlyCount";
import type { HourlyCount } from "@/types/api/response/common/HourlyCount";
import type { MonthShortName } from "@/types/dates/Dates";

export function groupMonthly(resp?: ObservationStatisticResponse) {
  const rows = (resp?.monthlyData ?? []) as MonthlyCount[];
  // { 2019: [1월엔 12일 관측, 2월엔 13일 관측, ...] }
  const byYear = new Map<number, number[]>();
  for (const r of rows) {
    if (!byYear.has(r.year)) byYear.set(r.year, Array(12).fill(0));
    byYear.get(r.year)![r.month - 1] += r.count;
  }
  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  const total = Array(12).fill(0);
  years.forEach((y) =>
    byYear.get(y)!.forEach((count, monthIdx) => (total[monthIdx] += count))
  );

  const toSeries = (arr: number[]) =>
    [...monthShortNames].map((monthShortName, i) => ({
      monthShortName,
      count: arr[i] || 0,
    }));

  const totalDaysCount: number = total.reduce((a, b) => a + b, 0);
  const mostFrequentMonth: MonthShortName =
    monthShortNames[total.findIndex((count) => count === Math.max(...total))];

  return {
    years,
    byYear,
    totalSeries: toSeries(total),
    seriesOf: (year: number) => toSeries(byYear.get(year) ?? Array(12).fill(0)),
    mostFrequentMonth,
    totalDaysCount,
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

  const years = Array.from(store.keys()).sort((a, b) => a - b);
  const byYearMonth = (year: number, month: number) =>
    (store.get(year)?.get(month) ?? Array(24).fill(0)).map((count, hour) => ({
      hour: hour.toString().padStart(2, "0"),
      count,
    }));

  const totalOf = (month: number) => {
    const acc = Array(24).fill(0);
    years.forEach((y) =>
      (store.get(y)?.get(month) ?? Array(24).fill(0)).forEach(
        (count, hour) => (acc[hour] += count)
      )
    );
    return acc.map((count, hour) => ({
      hour: hour.toString().padStart(2, "0"),
      count,
    }));
  };

  const mostFrequentHour = (month: number | MonthShortName) => {
    let monthValue = 1;
    if (typeof month === "number") {
      monthValue = month;
    } else {
      monthValue = monthShortNames.indexOf(month) + 1;
    }
    const totalCounts = totalOf(monthValue).map(({ count }) => count);
    const maxCount = Math.max(...totalCounts);
    const hourIdx = totalCounts.findIndex((c) => c === maxCount);
    return hourIdx.toString().padStart(2, "0");
  };

  return { years, byYearMonth, totalOf, mostFrequentHour };
}
