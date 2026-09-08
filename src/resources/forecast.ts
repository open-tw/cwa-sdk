import { CwaNotFoundError } from "../errors.js";
import { cwaFetch } from "../http.js";
import type {
  CwaApiResponse,
  ForecastRecords,
  GetTownshipForecastParams,
} from "../types.js";

/**
 * 天氣預報相關資料集，dataset ID 皆以 "F-" 開頭。
 */
export class ForecastResource {
  constructor(private apiKey: string) {}

  /**
   * 今明 36 小時天氣預報（F-C0032-001）。
   * 回傳官方原始資料結構（已標好型別），未經任何轉換。
   *
   * @param params.locationName 指定縣市，省略則回傳全部 22 縣市
   */
  async getTownshipForecast(
    params: GetTownshipForecastParams = {},
  ): Promise<CwaApiResponse<ForecastRecords>> {
    const raw = (await cwaFetch(this.apiKey, "F-C0032-001", {
      locationName: params.locationName,
    })) as CwaApiResponse<ForecastRecords>;

    if (params.locationName && raw.records.location.length === 0) {
      throw new CwaNotFoundError(200, `locationName="${params.locationName}"`);
    }

    return raw;
  }
}
