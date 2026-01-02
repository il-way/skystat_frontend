import { monthValues } from "@/lib/date";
import {
  buildAverageSummaryURL,
  buildCloudURL,
  buildMonthlyCountSummaryURL,
  buildTemperatureURL,
  buildThresholdURL,
  buildWeatherURL,
  buildWindRoseURL,
  buildWindSpeedAverageMonthlyURL,
} from "@/lib/url";
import type { BasicQueryParams } from "@/api/types/request/statistic/BasicQueryParams";
import type { CloudStatisticQueryParams } from "@/api/types/request/statistic/CloudStatisticQueryParams";
import type { TemperatureStatisticQueryParams } from "@/api/types/request/statistic/TemperatureStatisticQueryParams";
import type { ThresholdStatisticQueryParams } from "@/api/types/request/statistic/ThresholdStatisticQueryParams";
import type { WeatherStatisticQueryParams } from "@/api/types/request/statistic/WeatherStatisticQueryParams";
import type { WindRoseQueryParams } from "@/api/types/request/statistic/WindRoseQueryParams";
import type { AverageSummaryResponse } from "@/api/types/response/statistic/AverageSummaryResponse";
import type { AverageWindSpeedMonthlyResponse } from "@/api/types/response/statistic/AverageWindSpeedMonthlyResponse";
import type { ObservationStatisticResponse } from "@/api/types/response/statistic/ObservationStatisticResponse";
import type { TemperatureStatisticResponse } from "@/api/types/response/statistic/TemperatureStatisticResponse";
import type { WindroseResponse } from "@/api/types/response/windrose/WindroseResponse";
import type { DashboardTableRow } from "@/pages/dashboard/types/DashboardTable";
import type { MonthlyCountSummaryQueryParams } from "./types/request/statistic/MonthlyCountSummaryQueryParams";
import type { MonthlyCountSummaryResponse } from "./types/response/statistic/MonthlyCountSummaryResponse";

export class MetarStatisticApi {
  
  static basePath = import.meta.env.VITE_API_SERVER_URL ?? "/api";

  static async fetchAverageWindSpeedMonthly(params: BasicQueryParams) {
    const uri =MetarStatisticApi.basePath + buildWindSpeedAverageMonthlyURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<AverageWindSpeedMonthlyResponse>;
  }

  static async fetchTemperatureStatistic(
    params: TemperatureStatisticQueryParams
  ) {
    const uri = MetarStatisticApi.basePath + buildTemperatureURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<TemperatureStatisticResponse>;
  }

  static async fetchThresholdStatistic(params: ThresholdStatisticQueryParams) {
    const uri = MetarStatisticApi.basePath + buildThresholdURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchCloudStatistic(params: CloudStatisticQueryParams) {
    const uri = MetarStatisticApi.basePath + buildCloudURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchWeatherStatistic(params: WeatherStatisticQueryParams) {
    const uri = MetarStatisticApi.basePath + buildWeatherURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchWindRoseStatistic(params: WindRoseQueryParams) {
    const uri = MetarStatisticApi.basePath + buildWindRoseURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<WindroseResponse>;
  }

  static async fetchAverageSummary(params: BasicQueryParams) {
    const path = buildAverageSummaryURL(params);
    const uri = `${this.basePath}${path}`;
    const res = await fetch(uri, {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<AverageSummaryResponse>;
  }

  static async fetchMonthlyCountSummary(params: MonthlyCountSummaryQueryParams) {
    const path = buildMonthlyCountSummaryURL(params);
    const uri = `${this.basePath}${path}`;
    const res = await fetch(uri, {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await res.json() as MonthlyCountSummaryResponse;

    const result: DashboardTableRow[] = monthValues.map((m) => ({
      month: m,
      windPeak: 0,
      visibility: 0,
      ceiling: 0,
      thunderStorm: 0,
      snow: 0,
    }));

    data.monthly.forEach((m) => {
      const { month, windPeakCount,visibilityCount, ceilingCount, phenomenonCount, descriptorCount } = m;
      result[month-1].windPeak += windPeakCount;
      result[month-1].visibility += visibilityCount;
      result[month-1].ceiling += ceilingCount;
      result[month-1].snow += phenomenonCount;
      result[month-1].thunderStorm += descriptorCount;
    })

    return result;
  }


}
