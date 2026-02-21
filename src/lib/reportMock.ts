export type TimeSeriesPoint = {
  month: string;
  value: number;
};

export type MonthlyObservedDay = {
  month: string;
  days: number;
};

export type ReportMock = {
  icao: string;
  airportName: string;
  region: string;
  period: string;
  summary: string;
  sampleCount: number;
  avgVisibilityKm: number;
  avgCeilingFt: number;
  avgWindSpeedKt: number;
  windSeries: TimeSeriesPoint[];
  visSeries: TimeSeriesPoint[];
  monthlyObservedDays: MonthlyObservedDay[];
  disclaimer: string;
};

const REPORTS: Record<string, ReportMock> = {
  RKSI: {
    icao: "RKSI",
    airportName: "인천국제공항",
    region: "인천, 대한민국",
    period: "2023-01-01 ~ 2024-01-01",
    summary: "연중 시정은 양호하지만 장마철과 이른 아침 시간대에 저시정 구간이 간헐적으로 관측됩니다.",
    sampleCount: 8400,
    avgVisibilityKm: 8.9,
    avgCeilingFt: 5200,
    avgWindSpeedKt: 11.4,
    windSeries: [
      { month: "2023-01", value: 10.1 },
      { month: "2023-03", value: 11.8 },
      { month: "2023-05", value: 12.2 },
      { month: "2023-07", value: 9.7 },
      { month: "2023-09", value: 10.9 },
      { month: "2023-11", value: 12.4 },
      { month: "2024-01", value: 11.1 },
    ],
    visSeries: [
      { month: "2023-01", value: 9.5 },
      { month: "2023-03", value: 9.1 },
      { month: "2023-05", value: 8.6 },
      { month: "2023-07", value: 7.8 },
      { month: "2023-09", value: 8.1 },
      { month: "2023-11", value: 8.9 },
      { month: "2024-01", value: 9.3 },
    ],
    monthlyObservedDays: [
      { month: "2023-01", days: 31 },
      { month: "2023-02", days: 28 },
      { month: "2023-03", days: 31 },
      { month: "2023-04", days: 30 },
      { month: "2023-05", days: 31 },
      { month: "2023-06", days: 30 },
      { month: "2023-07", days: 31 },
      { month: "2023-08", days: 31 },
      { month: "2023-09", days: 30 },
      { month: "2023-10", days: 31 },
      { month: "2023-11", days: 30 },
      { month: "2023-12", days: 31 },
    ],
    disclaimer:
      "본 보고서는 공개 기상 관측 데이터를 기반으로 한 통계 요약입니다. 실제 운항 의사결정에는 공식 기상 브리핑과 운항 규정을 함께 확인해야 합니다.",
  },
  KJFK: {
    icao: "KJFK",
    airportName: "존 F. 케네디 국제공항",
    region: "뉴욕, 미국",
    period: "2023-01-01 ~ 2024-01-01",
    summary: "겨울철 강풍과 저운고 빈도가 높고, 여름철 대류성 현상으로 변동성이 커지는 경향이 있습니다.",
    sampleCount: 8352,
    avgVisibilityKm: 8.2,
    avgCeilingFt: 4700,
    avgWindSpeedKt: 13.1,
    windSeries: [
      { month: "2023-01", value: 14.8 },
      { month: "2023-03", value: 13.9 },
      { month: "2023-05", value: 12.7 },
      { month: "2023-07", value: 10.9 },
      { month: "2023-09", value: 11.6 },
      { month: "2023-11", value: 13.4 },
      { month: "2024-01", value: 14.1 },
    ],
    visSeries: [
      { month: "2023-01", value: 8.6 },
      { month: "2023-03", value: 8.3 },
      { month: "2023-05", value: 8.4 },
      { month: "2023-07", value: 7.6 },
      { month: "2023-09", value: 7.9 },
      { month: "2023-11", value: 8.0 },
      { month: "2024-01", value: 8.5 },
    ],
    monthlyObservedDays: [
      { month: "2023-01", days: 31 },
      { month: "2023-02", days: 28 },
      { month: "2023-03", days: 31 },
      { month: "2023-04", days: 30 },
      { month: "2023-05", days: 31 },
      { month: "2023-06", days: 30 },
      { month: "2023-07", days: 31 },
      { month: "2023-08", days: 31 },
      { month: "2023-09", days: 30 },
      { month: "2023-10", days: 31 },
      { month: "2023-11", days: 30 },
      { month: "2023-12", days: 31 },
    ],
    disclaimer:
      "본 보고서는 공개 기상 관측 데이터를 기반으로 한 통계 요약입니다. 실제 운항 의사결정에는 공식 기상 브리핑과 운항 규정을 함께 확인해야 합니다.",
  },
  EGLL: {
    icao: "EGLL",
    airportName: "런던 히드로 공항",
    region: "런던, 영국",
    period: "2023-01-01 ~ 2024-01-01",
    summary: "전선 통과 영향으로 풍속과 기압 변화가 잦고, 저운고 관측 구간이 계절에 따라 뚜렷하게 나타납니다.",
    sampleCount: 8415,
    avgVisibilityKm: 7.8,
    avgCeilingFt: 4300,
    avgWindSpeedKt: 12.3,
    windSeries: [
      { month: "2023-01", value: 13.9 },
      { month: "2023-03", value: 12.7 },
      { month: "2023-05", value: 11.5 },
      { month: "2023-07", value: 10.4 },
      { month: "2023-09", value: 11.8 },
      { month: "2023-11", value: 13.1 },
      { month: "2024-01", value: 13.5 },
    ],
    visSeries: [
      { month: "2023-01", value: 7.3 },
      { month: "2023-03", value: 7.6 },
      { month: "2023-05", value: 8.0 },
      { month: "2023-07", value: 8.3 },
      { month: "2023-09", value: 7.9 },
      { month: "2023-11", value: 7.2 },
      { month: "2024-01", value: 7.5 },
    ],
    monthlyObservedDays: [
      { month: "2023-01", days: 31 },
      { month: "2023-02", days: 28 },
      { month: "2023-03", days: 31 },
      { month: "2023-04", days: 30 },
      { month: "2023-05", days: 31 },
      { month: "2023-06", days: 30 },
      { month: "2023-07", days: 31 },
      { month: "2023-08", days: 31 },
      { month: "2023-09", days: 30 },
      { month: "2023-10", days: 31 },
      { month: "2023-11", days: 30 },
      { month: "2023-12", days: 31 },
    ],
    disclaimer:
      "본 보고서는 공개 기상 관측 데이터를 기반으로 한 통계 요약입니다. 실제 운항 의사결정에는 공식 기상 브리핑과 운항 규정을 함께 확인해야 합니다.",
  },
  RJTT: {
    icao: "RJTT",
    airportName: "도쿄 하네다 공항",
    region: "도쿄, 일본",
    period: "2023-01-01 ~ 2024-01-01",
    summary: "해륙풍 전환에 따라 풍향 변화가 빠르고, 우기 구간에서 시정 저하가 관찰됩니다.",
    sampleCount: 8367,
    avgVisibilityKm: 8.6,
    avgCeilingFt: 5000,
    avgWindSpeedKt: 10.8,
    windSeries: [
      { month: "2023-01", value: 11.2 },
      { month: "2023-03", value: 11.6 },
      { month: "2023-05", value: 10.7 },
      { month: "2023-07", value: 9.4 },
      { month: "2023-09", value: 10.3 },
      { month: "2023-11", value: 11.1 },
      { month: "2024-01", value: 10.9 },
    ],
    visSeries: [
      { month: "2023-01", value: 9.2 },
      { month: "2023-03", value: 8.8 },
      { month: "2023-05", value: 8.4 },
      { month: "2023-07", value: 7.9 },
      { month: "2023-09", value: 8.1 },
      { month: "2023-11", value: 8.7 },
      { month: "2024-01", value: 9.0 },
    ],
    monthlyObservedDays: [
      { month: "2023-01", days: 31 },
      { month: "2023-02", days: 28 },
      { month: "2023-03", days: 31 },
      { month: "2023-04", days: 30 },
      { month: "2023-05", days: 31 },
      { month: "2023-06", days: 30 },
      { month: "2023-07", days: 31 },
      { month: "2023-08", days: 31 },
      { month: "2023-09", days: 30 },
      { month: "2023-10", days: 31 },
      { month: "2023-11", days: 30 },
      { month: "2023-12", days: 31 },
    ],
    disclaimer:
      "본 보고서는 공개 기상 관측 데이터를 기반으로 한 통계 요약입니다. 실제 운항 의사결정에는 공식 기상 브리핑과 운항 규정을 함께 확인해야 합니다.",
  },
  WSSS: {
    icao: "WSSS",
    airportName: "싱가포르 창이 공항",
    region: "싱가포르",
    period: "2023-01-01 ~ 2024-01-01",
    summary: "고온다습한 환경에서 대류성 강수의 영향이 두드러지며, 시간대별 시정 변동이 나타납니다.",
    sampleCount: 8448,
    avgVisibilityKm: 8.1,
    avgCeilingFt: 4600,
    avgWindSpeedKt: 8.9,
    windSeries: [
      { month: "2023-01", value: 8.7 },
      { month: "2023-03", value: 8.3 },
      { month: "2023-05", value: 9.1 },
      { month: "2023-07", value: 9.4 },
      { month: "2023-09", value: 8.8 },
      { month: "2023-11", value: 8.5 },
      { month: "2024-01", value: 8.6 },
    ],
    visSeries: [
      { month: "2023-01", value: 8.4 },
      { month: "2023-03", value: 8.2 },
      { month: "2023-05", value: 7.8 },
      { month: "2023-07", value: 7.5 },
      { month: "2023-09", value: 7.9 },
      { month: "2023-11", value: 8.0 },
      { month: "2024-01", value: 8.3 },
    ],
    monthlyObservedDays: [
      { month: "2023-01", days: 31 },
      { month: "2023-02", days: 28 },
      { month: "2023-03", days: 31 },
      { month: "2023-04", days: 30 },
      { month: "2023-05", days: 31 },
      { month: "2023-06", days: 30 },
      { month: "2023-07", days: 31 },
      { month: "2023-08", days: 31 },
      { month: "2023-09", days: 30 },
      { month: "2023-10", days: 31 },
      { month: "2023-11", days: 30 },
      { month: "2023-12", days: 31 },
    ],
    disclaimer:
      "본 보고서는 공개 기상 관측 데이터를 기반으로 한 통계 요약입니다. 실제 운항 의사결정에는 공식 기상 브리핑과 운항 규정을 함께 확인해야 합니다.",
  },
};

export function getReportMock(icao: string) {
  return REPORTS[icao.toUpperCase()] ?? null;
}

export function getReportSamples(limit = 3) {
  return Object.values(REPORTS).slice(0, limit);
}

