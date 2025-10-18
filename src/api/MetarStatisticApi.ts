import { buildAverageSummaryURL, buildCloudURL, buildTemperatureURL, buildThresholdURL, buildWeatherURL, buildWindRoseURL } from "@/lib/url";
import type { BasicQueryParams } from "@/types/api/request/statistic/BasicQueryParams";
import type { CloudStatisticQueryParams } from "@/types/api/request/statistic/CloudStatisticQueryParams";
import type { TemperatureStatisticQueryParams } from "@/types/api/request/statistic/TemperatureStatisticQueryParams";
import type { ThresholdStatisticQueryParams } from "@/types/api/request/statistic/ThresholdStatisticQueryParams";
import type { WeatherStatisticQueryParams } from "@/types/api/request/statistic/WeatherStatisticQueryParams";
import type { WindRoseQueryParams } from "@/types/api/request/statistic/WindRoseQueryParams";
import type { AverageSummaryResponse } from "@/types/api/response/statistic/AverageSummaryResponse";
import type { ObservationStatisticResponse } from "@/types/api/response/statistic/ObservationStatisticResponse";

export class MetarStatisticApi {

  static host = "http://locahost:8080";

  static async fetchThresholdStatistic(params: ThresholdStatisticQueryParams) {
    const uri = MetarStatisticApi.host + buildThresholdURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchCloudStatistic(params: CloudStatisticQueryParams) {
    const uri = MetarStatisticApi.host + buildCloudURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchWeatherStatistic(params: WeatherStatisticQueryParams) {
    const uri = MetarStatisticApi.host + buildWeatherURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchWindRoseStatistic(params: WindRoseQueryParams) {
    const uri = MetarStatisticApi.host + buildWindRoseURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchTemperatureStatistic(params: TemperatureStatisticQueryParams) {
    const uri = MetarStatisticApi.host + buildTemperatureURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<ObservationStatisticResponse>;
  }

  static async fetchAverageSummary(params: BasicQueryParams) {
    const uri = MetarStatisticApi.host + buildAverageSummaryURL(params);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<AverageSummaryResponse>;
  }

}

