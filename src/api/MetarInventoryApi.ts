import { buildMetarInventoryURL } from "@/lib/url";
import type { DatasetCoverage } from "@/api/types/response/common/DatasetCoverage";

export class MetarInventoryApi {

  static host = `${import.meta.env.VITE_API_SERVER_URL}/api`;

  static async fetchDataCoverage(icao: string) {
    const uri = MetarInventoryApi.host + buildMetarInventoryURL(icao);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<DatasetCoverage>;
  }

}