import { buildMetarInventoryURL } from "@/lib/url";
import type { DatasetCoverage } from "@/types/api/response/common/DatasetCoverage";

export class MetarInventory {

  static host = "http://localhost:8080";

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