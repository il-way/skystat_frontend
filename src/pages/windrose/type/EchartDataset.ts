import type { MonthShortName } from "@/types/dates/Dates";

export type WindroseDataset = {
  speedBins: string[];
  directionBins: string[];
  series: Record<MonthShortName, WindroseSeries[]>;
  maxRate: number;
}

export type WindroseSeries = {
  speedBin: string;
  data: number[];
}

