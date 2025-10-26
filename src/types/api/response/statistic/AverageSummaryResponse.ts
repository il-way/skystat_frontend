export type AverageSummaryResponse = {
  coverageFrom: string;
  coverageTo: string;
  totalCount: number;
  avgVisibilityM: number;
  avgWindSpeedKt: number;
  avgWindPeakKt: number;
  avgAltimeterHpa: number;
  avgCeilingFt: number;
};