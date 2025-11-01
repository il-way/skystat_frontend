export type TemperaturedKpiValues = {
  years: number[];
  coverageFrom: string;
  coverageTo: string;
  sampleSize: number;
  annualMean: number;
  annualMax: number;
  annualMin: number;
  isFetched: boolean;
  hasData: boolean;
};