import {
  CwaAuthError,
  CwaNotFoundError,
  CwaRateLimitError,
  CwaUnknownError,
} from "./errors.js";

const BASE_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore";

/**
 * 底層共用的 fetch 邏輯，不直接對外開放。
 * 每個 resource（forecast、earthquake...）都透過這支函式打 API，
 * 確保 apiKey、baseURL、錯誤處理邏輯只寫一份。
 *
 * 官方文件確認同時支援「URL 參數」與「HTTP Header」兩種授權方式，
 * 這裡選擇用 Header 傳遞，避免 API Key 出現在 URL / log 裡。
 */
export async function cwaFetch(
  apiKey: string,
  datasetId: string,
  params?: Record<string, string | undefined>,
): Promise<unknown> {
  const url = new URL(`${BASE_URL}/${datasetId}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
  }

  const res = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        throw new CwaAuthError(res.status);
      case 404:
        throw new CwaNotFoundError(res.status, datasetId);
      default:
        throw new CwaUnknownError(res.status, res.statusText);
    }
  }

  return res.json();
}
