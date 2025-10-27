import { monthValues } from "@/lib/date";
import {
  buildAverageSummaryURL,
  buildCloudURL,
  buildTemperatureURL,
  buildThresholdURL,
  buildWeatherURL,
  buildWindRoseURL,
  buildWindSpeedAverageMonthlyURL,
} from "@/lib/url";
import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import type { CloudStatisticQueryParams } from "@/types/api/request/statistic/CloudStatisticQueryParams";
import type { TemperatureStatisticQueryParams } from "@/types/api/request/statistic/TemperatureStatisticQueryParams";
import type { ThresholdStatisticQueryParams } from "@/types/api/request/statistic/ThresholdStatisticQueryParams";
import type { WeatherStatisticQueryParams } from "@/types/api/request/statistic/WeatherStatisticQueryParams";
import type { WindRoseQueryParams } from "@/types/api/request/statistic/WindRoseQueryParams";
import type { AverageSummaryResponse } from "@/types/api/response/statistic/AverageSummaryResponse";
import type { AverageWindSpeedMonthlyResponse } from "@/types/api/response/statistic/AverageWindSpeedMonthlyResponse";
import type { ObservationStatisticResponse } from "@/types/api/response/statistic/ObservationStatisticResponse";
import type { TemperatureStatisticResponse } from "@/types/api/response/statistic/TemperatureStatisticResponse";
import type { DashboardTableRow } from "@/types/components/dashboard/DashboardTable";

export class MetarStatisticApi {
  static host = "/api";

  static async fetchAverageWindSpeedMonthly(params: BasicQueryParams) {
    const uri =MetarStatisticApi.host + buildWindSpeedAverageMonthlyURL(params);
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
    const uri = MetarStatisticApi.host + buildTemperatureURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<TemperatureStatisticResponse>;
  }

  static async fetchThresholdStatistic(params: ThresholdStatisticQueryParams) {
    const uri = MetarStatisticApi.host + buildThresholdURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchCloudStatistic(params: CloudStatisticQueryParams) {
    const uri = MetarStatisticApi.host + buildCloudURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchWeatherStatistic(params: WeatherStatisticQueryParams) {
    const uri = MetarStatisticApi.host + buildWeatherURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchWindRoseStatistic(params: WindRoseQueryParams) {
    const uri = MetarStatisticApi.host + buildWindRoseURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchAverageSummary(params: BasicQueryParams) {
    const path = buildAverageSummaryURL(params);
    const uri = `${this.host}${path}`;
    const res = await fetch(uri, {
      headers: {
        Accept: "application/json",
      },
    });
    return res.json() as Promise<AverageSummaryResponse>;
  }

  static async fetchDashboadTableSummary(params: BasicQueryParams) {
    const { windPeakParams, visibilityParams, ceilingParams, thunderStormParams, snowParams } = MetarStatisticApi.buildDashboardTableParams(params);

    const response = await Promise.allSettled([
      this.fetchThresholdStatistic(windPeakParams),
      this.fetchThresholdStatistic(visibilityParams),
      this.fetchThresholdStatistic(ceilingParams),
      this.fetchWeatherStatistic(thunderStormParams),
      this.fetchWeatherStatistic(snowParams),
    ]);

    const fields: Array<keyof Omit<DashboardTableRow, "month">> = [
      "windPeak",
      "visibility",
      "ceiling",
      "thunderStorm",
      "snow",
    ];
    const result: DashboardTableRow[] = monthValues.map((m) => ({
      month: m,
      windPeak: 0,
      visibility: 0,
      ceiling: 0,
      thunderStorm: 0,
      snow: 0,
    }));

    const list = response.map((obs) =>
      obs.status === "fulfilled" ? obs.value.monthlyData : []
    );
    list.forEach((monthlyCountList, idx) => {
      const field = fields[idx];
      monthlyCountList.forEach(({ month, count }) => {
        const row = result[month - 1];
        if (row && row.month === month) {
          row[field] += count;
        }
      });
    });

    return result;
  }

  private static buildDashboardTableParams(params: BasicQueryParams) {
    const { icao, startISO, endISO } = params;
    const windPeakParams: ThresholdStatisticQueryParams = {
      icao,
      field: "windpeak",
      comparison: "GTE",
      threshold: 30,
      unit: "KT",
      startISO,
      endISO,
    };

    // vis <= 800m
    const visibilityParams: ThresholdStatisticQueryParams = {
      icao,
      field: "visibility",
      comparison: "LTE",
      threshold: 800,
      unit: "METERS",
      startISO,
      endISO,
    };

    // ceiling <= 200ft
    const ceilingParams: ThresholdStatisticQueryParams = {
      icao,
      field: "ceiling",
      comparison: "LTE",
      threshold: 200,
      unit: "FEET",
      startISO,
      endISO,
    };

    // ts
    const thunderStormParams: WeatherStatisticQueryParams = {
      icao,
      condition: "descriptor",
      list: ["TS"],
      startISO,
      endISO,
    };

    // sn
    const snowParams: WeatherStatisticQueryParams = {
      icao,
      condition: "phenomena",
      list: ["SN"],
      startISO,
      endISO,
    };

    return {
      windPeakParams,
      visibilityParams,
      ceilingParams,
      thunderStormParams,
      snowParams,
    };
  }
}
