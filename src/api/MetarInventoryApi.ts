import { buildMetarInventoryURL } from "@/lib/url";
import type { DatasetCoverage } from "@/api/types/response/common/DatasetCoverage";

export class MetarInventory {

  static host = "/api";

  static async fetchDataCoverage(icao: string) {
    const uri = MetarInventory.host + buildMetarInventoryURL(icao);
    const res = await fetch(uri.toString(), {
      headers: {
        Accept: 'application/json',
      }
    });
    return res.json() as Promise<DatasetCoverage>;
  }

}