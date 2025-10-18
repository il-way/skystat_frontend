export type MetarRow = {
  id: number;
  station: string;
  time: string;           // ISO string
  windDir: number;
  windSpdKt: number;
  vis: number;
  ceiling?: number | null;
  weather: string;
  qnh: number;
};