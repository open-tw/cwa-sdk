import { TOWNSHIP_FORECAST_DATASETS } from "../data/datasets.js";
import { CwaNotFoundError, CwaUnsupportedCountyError } from "../errors.js";
import { cwaFetch } from "../http.js";
import type {
  CwaApiResponse,
  ForecastRecords,
  Get36HourForecastParams,
  GetTownshipForecastParams,
  TownshipForecastRecords,
} from "../types.js";

/**
 * 天氣預報相關資料集，dataset ID 皆以 "F-" 開頭。
 */
export class ForecastResource {
  constructor(private apiKey: string) {}

  /**
   * 今明 36 小時天氣預報（F-C0032-001），資料為「縣市」層級。
   * 回傳官方原始資料結構（已標好型別），未經任何轉換。
   *
   * 鄉鎮市區層級的預報屬於 F-D0047 系列，為不同的資料集。
   *
   * @param params.locationName 指定縣市，省略則回傳全部 22 縣市
   */
  async get36HourForecast(
    params: Get36HourForecastParams = {},
  ): Promise<CwaApiResponse<ForecastRecords>> {
    const raw = (await cwaFetch(this.apiKey, "F-C0032-001", {
      locationName: params.locationName,
    })) as CwaApiResponse<ForecastRecords>;

    if (params.locationName && raw.records.location.length === 0) {
      throw new CwaNotFoundError(200, `locationName="${params.locationName}"`);
    }

    return raw;
  }

  /**
   * 鄉鎮天氣預報（F-D0047 系列），資料為「鄉鎮市區」層級。
   * 回傳官方原始資料結構，未經任何轉換。
   *
   * 每個縣市對應兩個 dataset（3 天 / 1 週），由 params.range 決定。
   *
   * @param params.county 指定縣市，決定查詢的 dataset
   * @param params.range 時間範圍，預設 "3days"
   * @param params.locationName 指定鄉鎮市區，省略則回傳該縣市全部鄉鎮
   *
   * @throws {CwaUnsupportedCountyError} county 不是合法的縣市名稱
   *   （TypeScript 下由型別擋住；此檢查是為了 JavaScript 呼叫端）
   */
  async getTownshipForecast(
    params: GetTownshipForecastParams,
  ): Promise<CwaApiResponse<TownshipForecastRecords>> {
    const { county, range = "3days", locationName } = params;

    const datasetId = TOWNSHIP_FORECAST_DATASETS[county]?.[range];
    if (!datasetId) {
      throw new CwaUnsupportedCountyError(county);
    }

    const raw = (await cwaFetch(this.apiKey, datasetId, {
      locationName,
    })) as CwaApiResponse<TownshipForecastRecords>;

    if (locationName && !raw.records.Locations[0]?.Location.length) {
      throw new CwaNotFoundError(200, `locationName="${locationName}"`);
    }

    return raw;
  }
}
