import type { WindroseResponse } from "@/types/api/response/windrose/WindroseResponse";
import type { WindroseDataset } from "./type/EchartDataset";
import { monthShortNameFrom, monthShortNames } from "@/lib/date";
import type { M } from "node_modules/framer-motion/dist/types.d-BJcRxCew";
import type { MonthShortName } from "@/types/dates/Dates";
import { round2 } from "@/lib/temperature";

export function buildWindroseDataset(resp?: WindroseResponse) {
  const base = emptyDataset();
  if (!resp || resp.data.length === 0) return base;

  base.speedBins = [...resp.speedBins];
  base.directionBins = [...resp.directionBins];
  const initMonthSeries = (monthName: MonthShortName) => {
    if (base.series[monthName].length === 0) {
      base.speedBins.forEach((sb) => {
        base.series[monthName].push({
          speedBin: sb,
          data: new Array(base.directionBins.length).fill(0),
        });
      });
    }
  };

  for (const data of resp.data) {
    const monthName = monthShortNameFrom(data.month);
    if (!base.series[monthName]) continue;
    initMonthSeries(monthName);
    
    const { sbIndex, dbIndex, rate } = data;
    if (sbIndex < 0 || sbIndex >= base.speedBins.length) continue;
    if (dbIndex < 0 || dbIndex >= base.directionBins.length) continue;

    const series = base.series[monthName];
    series[sbIndex].data[dbIndex] += (round2(rate) ?? 0);
    base.maxRate = Math.max(base.maxRate, series[sbIndex].data[dbIndex]);
  }

  return base;
}

function emptyDataset() {
  const base: WindroseDataset = {
    speedBins: [],
    directionBins: [],
    series: {} as WindroseDataset["series"],
    maxRate: 0,
  };
  monthShortNames.forEach((m) => (base.series[m] = []));

  return base;
}

export function buildEchartOptions(dataset: WindroseDataset, month: number) {
  const { speedBins, directionBins, series } = dataset;
  const monthName = monthShortNameFrom(month);
  const calmRate = series[monthName].find((s) => s.speedBin === "CALM")
    ?.data.reduce((a, b) => a + b, 0) ?? 0;

  const nonCalmSeries = series[monthName].filter((s) => s.speedBin !== "CALM")
    .map(s => ({
      type: 'bar',
      name: s.speedBin, 
      data: s.data,
      coordinateSystem: 'polar',
      stack: 'a'
    }));

  const yAxisRates = new Array(directionBins.length).fill(0);
  series[monthName].forEach(s => {
    s.data.forEach((rate, idx) => yAxisRates[idx] += rate);
  });
  const maxRate = Math.max(...yAxisRates);

  return {
    tooltip: {
      trigger: 'item',
      textStyle: { color: '#333' },
    },
    color: ["#0001F7", "#0284c7", "#00B8FE", "#00FF68", "#BEFE00", "#FFFF00", "#FFA800", "#E10100"],
    angleAxis: {
      type: 'category',
      data: directionBins,
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: { },
      },
      axisLabel: {
        show: true,
        interval: 1,
      },
    },
    radiusAxis: {
      min: 0,
      max: 1.2*maxRate,
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
    },
    polar: {
      center: ['50%', '55%'],
      radius: ['13%', '75%'],
    },
    series: [
      ...nonCalmSeries,
      { type: 'bar', coordinateSystem: 'polar', name: "CALM", stack: 'a' },
      {
        type: 'pie',
        center: ['50%', '55%'],
        radius: ['13%', '13%'],
        avoidLabelOverlap: false,
        label: {
          color: '#000',
          fontSize: '11',
          position: 'center',
          formatter: () => {
            return `Calm\n${calmRate}`;
          },
        },
        labelLine: {
          show: false,
        },
        data: [{ name: 'CALM (0-1KT)', value: calmRate }],
      },
    ],
    legend: {
      show: true,
      data: speedBins,
      width: '100%',
    }
  }
}