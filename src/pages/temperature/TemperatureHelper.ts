import type { TemperatureStatisticResponse } from "@/api/types/response/statistic/TemperatureStatisticResponse";
import { monthShortNameFrom } from "../../lib/date";
import type { MonthlyTemperatureStat } from "@/api/types/response/common/MonthlyTemperatureStat";
import type { HourlyTemperatureStat } from "@/api/types/response/common/HourlyTemperatureStat";
import { round2 } from "@/lib/math";
import type { HourlyTableRow } from "./types/HourlyTableRow";
import type { MonthlyTableRow } from "./types/MonthlyTableRow";

const H24 = Array.from({ length: 24}, (_, i) => i);

export function getYeras(resp?: TemperatureStatisticResponse): number[] {
  if (!resp) return [];
  return Array.from(new Set(resp.yearly.map(y => y.year)))
    .sort((a,b) => a-b);
}

export function groupMonthly(resp?: TemperatureStatisticResponse) {
  const years = getYeras(resp);
  
  return {
    years,
    seriesOf: (year: number) => monthlySeriesOf(resp, year),
    tableOf: (year: number) => monthlyTable(resp, { year }),
    totalSeries: monthlySeriesTotal(resp),
    totalTable: monthlyTable(resp, { total: true }),
  };
}

export function groupHourly(resp?: TemperatureStatisticResponse) {
  const years = getYeras(resp);

  return {
    years,
    seriesOf: (year: number, month: number) => hourlySeriesByYearMonth(resp, year, month),
    tableOf: (year: number, month: number) => hourlyTable(resp, { year, month }),
    totalSeriesOf: (month: number) => hourlySeriesTotal(resp, month),
    totalTableOf: (month: number) => hourlyTable(resp, { total: true, month }),
  };
}

export function groupYearly(resp?: TemperatureStatisticResponse) {
  const years = getYeras(resp);
  const base = {
    years,
    annualMean: 0,
    annualMax: 0,
    annualMin: 0,
  };
  
  if (!resp || years.length === 0) return base;
  return {
    years,
    annualMean: resp.yearly.reduce((acc, cur) => acc + cur.dailyMeanAvg, 0) / years.length,
    annualMax: Math.max(...resp.yearly.map(y => y.yearlyMax)),
    annualMin: Math.min(...resp.yearly.map(y => y.yearlyMin))
  }
}

function monthlySeriesOf(resp: TemperatureStatisticResponse | undefined, year: number) {
  const base = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthShortName: monthShortNameFrom(i + 1),
    dailyMeanAvg: 0,
    dailyMaxAvg: 0,
    dailyMinAvg: 0,
  }));

  if (!resp) return base;

  const map = new Map(resp.monthly.filter((m) => m.year === year)
    .map((m) => [m.month, m]));

  return base.map((b) => {
    const r = map.get(b.month);
    return {
      ...b,
      dailyMeanAvg: r ? round2(r.dailyMeanAvg) : null,
      dailyMaxAvg: r ? round2(r.dailyMaxAvg) : null,
      dailyMinAvg: r ? round2(r.dailyMinAvg) : null,
    };
  });
}

function monthlySeriesTotal(resp?: TemperatureStatisticResponse) {
  const base = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthShortName: monthShortNameFrom(i + 1),
    dailyMeanAvg: 0,
    dailyMaxAvg: 0,
    dailyMinAvg: 0,
  }));

  if (!resp) return base;

  const buckets = new Map<number, MonthlyTemperatureStat[]>();
  resp.monthly.forEach((m) => {
    const arr = buckets.get(m.month) ?? [];
    arr.push(m);
    buckets.set(m.month, arr);
  });
  return base.map((b) => {
    const arr = buckets.get(b.month) ?? [];
    if (!arr.length) return b;
    return {
      ...b,
      dailyMeanAvg: round2(avg(arr.map((x) => x.dailyMeanAvg))),
      dailyMaxAvg: round2(avg(arr.map((x) => x.dailyMaxAvg))),
      dailyMinAvg: round2(avg(arr.map((x) => x.dailyMinAvg))),
    };
  });
}

function monthlyTable(resp: TemperatureStatisticResponse | undefined, mode: { year: number } | { total: true }) {
  const base: MonthlyTableRow[] = Array(12).fill(0).map((_, i) => ({
    month: i+1,
    monthShotrName: monthShortNameFrom(i+1),
    mean: 0,
    meanMax: 0,
    meanMin: 0,
    monthlyMax: 0,
    monthlyMin: 0,
  }));

  if (!resp) return base;
  if ("year" in mode) {
    const map = new Map(resp.monthly.filter(m => m.year === mode.year)
      .map(m => [m.month, m]));

    return base.map(b => {
      const r = map.get(b.month);
      if (r === null || r === undefined) return b;
      
      return {
        ...b,
        mean: round2(r?.dailyMeanAvg),
        meanMax: round2(r?.dailyMaxAvg),
        meanMin: round2(r?.dailyMinAvg),
        monthlyMax: round2(r?.monthlyMax),
        monthlyMin: round2(r?.monthlyMin),
      };
    })
  }

  // total
  const buckets = new Map<number, MonthlyTemperatureStat[]>();
  resp.monthly.forEach(m => {
    const arr = buckets.get(m.month) ?? [];
    arr.push(m);
    buckets.set(m.month, arr);
  })

  return base.map(b => {
    const arr = buckets.get(b.month) ?? [];
    if (!arr.length) return b;
    
    return {
      ...b,
      mean: round2(avg(arr.map((x) => x.dailyMeanAvg))),
      meanMax: round2(avg(arr.map((x) => x.dailyMaxAvg))),
      meanMin: round2(avg(arr.map((x) => x.dailyMinAvg))),
      monthlyMax: round2(Math.max(...arr.map((x) => x.monthlyMax))),
      monthlyMin: round2(Math.min(...arr.map((x) => x.monthlyMin))),
    }
  })
}

function hourlySeriesByYearMonth(resp: TemperatureStatisticResponse | undefined, year: number, month: number) {
  const base = H24.map((h) => ({ hour: String(h).padStart(2, "0"), mean: 0 }));
  if (!resp) return base;
  const map = new Map(resp.hourly.filter((h) => h.year === year && h.month === month).map((h) => [h.hour, h]));
  return base.map((b) => {
    const r = map.get(Number(b.hour));
    return { ...b, mean: r ? round2(r.meanTempAtHour) : null };
  });
}

function hourlySeriesTotal(resp: TemperatureStatisticResponse | undefined, month: number) {
  const base = H24.map((h) => ({ hour: String(h).padStart(2, "0"), mean: null as number | null }));
  if (!resp) return base;
  const buckets = new Map<number, HourlyTemperatureStat[]>();
  resp.hourly
    .filter((h) => h.month === month)
    .forEach((h) => {
      const arr = buckets.get(h.hour) ?? [];
      arr.push(h);
      buckets.set(h.hour, arr);
    });

  return base.map((b) => {
    const arr = buckets.get(Number(b.hour)) ?? [];
    if (!arr.length) return b;
    return { ...b, mean: round2(avg(arr.map((x) => x.meanTempAtHour))) };
  });
}

function hourlyTable(resp: TemperatureStatisticResponse | undefined, 
                     mode: { year: number, month: number } | { total: true, month: number }) {

  const base: HourlyTableRow[] = H24.map((h) => ({
    hour: String(h).padStart(2, "0"),
    mean: 0,
    max: 0,
    min: 0
  }))

  if (!resp) return base;

  if ("year" in mode) {
    const map = new Map(
       resp.hourly
        .filter(h => h.year === mode.year && h.month === mode.month)
        .map(h => [h.hour, h])
    );

    return base.map(b => {
      const r = map.get(Number(b.hour));
      if (r === null || r === undefined) return base;

      return {
        ...b,
        mean: round2(r.meanTempAtHour),
        max: round2(r.maxTempAtHour),
        min: round2(r.minTempAtHour),
      };
    }) as HourlyTableRow[];
  }

  const buckets = new Map<number, HourlyTemperatureStat[]>();
  resp.hourly
    .filter((h) => h.month === mode.month)
    .forEach((h) => {
      const arr = buckets.get(h.hour) ?? [];
      arr.push(h);
      buckets.set(h.hour, arr);
    });
      
  return base.map((b) => {
    const arr = buckets.get(Number(b.hour)) ?? [];
    if (!arr.length) return b;
    return {
      ...b,
      mean: round2(avg(arr.map((x) => x.meanTempAtHour))),
      max: round2(Math.max(...arr.map((x) => x.maxTempAtHour))),
      min: round2(Math.min(...arr.map((x) => x.minTempAtHour))),
    };
  });  
}

function avg(xs: (number | null |undefined)[]) {
  const arr = xs.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  return arr.length > 0
    ? arr.reduce((a,b) => a+b, 0) / arr.length
    : null;
};