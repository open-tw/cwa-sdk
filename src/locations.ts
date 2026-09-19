import { COUNTIES, TOWNSHIPS } from "./data/locations.js";
import type { TaiwanCounty } from "./types.js";

/**
 * 台灣行政區靜態資料，與 CWA 使用的 locationName 對齊。
 *
 * 純本地查表，不會發出任何網路請求，因此為同步函式。
 * 注意名稱一律用「臺」而非「台」（臺北市、臺中市、臺南市、臺東縣）。
 *
 * @example
 * ```ts
 * import { locations } from "@open-tw/cwa-sdk";
 *
 * locations.counties();            // ["宜蘭縣", "花蓮縣", ...]
 * locations.townships("臺北市");   // ["中正區", "大同區", ...]
 * ```
 */
export const locations = {
  /**
   * 取得全部 22 個縣市，順序同附錄 A『全臺縣市鄉鎮對照表』。
   */
  counties(): TaiwanCounty[] {
    return [...COUNTIES];
  },

  /**
   * 取得指定縣市所轄的鄉鎮市區。
   *
   * @param county 縣市名稱
   * @returns 鄉鎮市區名稱陣列；縣市不存在時回傳空陣列
   */
  townships(county: TaiwanCounty): string[] {
    const list = TOWNSHIPS[county];
    return list ? [...list] : [];
  },
};
