# @open-tw/cwa-sdk

台灣中央氣象署（CWA）開放資料 API 的非官方 TypeScript SDK。提供完整型別定義、統一錯誤處理、自動處理常見的 API 呼叫細節，讓你不用重複造輪子。

> 本專案為社群維護，非中央氣象署官方套件。資料來源：[氣象資料開放平臺](https://opendata.cwa.gov.tw/)

隸屬於 [open-tw](https://github.com/open-tw) — 台灣政府開放資料 TypeScript SDK 系列。

## 為什麼需要這個套件？

中央氣象署提供的 Open Data API 功能完整，但官方文件僅提供 Swagger 規格，開發者每次串接都得自己處理：

- API Key 的請求格式與參數命名（`Authorization`、`format` 等）
- 錯誤情境（Key 失效、超過流量限制、資料集不存在）沒有統一的錯誤型別
- 回傳的 JSON 結構龐大且巢狀，手刻 TypeScript interface 容易出錯或漏欄位

`@open-tw/cwa-sdk` 把這些重複工作封裝起來，讓你專注在應用邏輯本身。

## 安裝

```bash
npm install @open-tw/cwa-sdk
# 或
pnpm add @open-tw/cwa-sdk
# 或
yarn add @open-tw/cwa-sdk
```

## 快速開始

在使用前，請先至 [氣象資料開放平臺](https://opendata.cwa.gov.tw) 註冊會員並取得 API Key。

```ts
import { CwaClient, CwaAuthError } from "@open-tw/cwa-sdk";

const client = new CwaClient({ apiKey: process.env.CWA_API_KEY! });

try {
  const forecast = await client.forecast.getTownshipForecast({
    locationName: "苗栗縣", // 省略則回傳全部 22 縣市
  });

  console.log(forecast.records.location[0].weatherElement);
} catch (error) {
  if (error instanceof CwaAuthError) {
    console.error("API Key 無效或已過期，請確認是否正確設定");
  } else {
    throw error;
  }
}
```

## 行政區資料（locations）

SDK 內建全臺 22 縣市、368 個鄉鎮市區的對照資料，不需要 API Key，也不會發出網路請求，適合用來做縣市／鄉鎮的二層連動選單。

```ts
import { locations } from "@open-tw/cwa-sdk";

locations.counties();
// ["宜蘭縣", "桃園市", "新竹縣", ..., "連江縣", "金門縣"]

locations.townships("臺北市");
// ["北投區", "士林區", "內湖區", ..., "大安區", "文山區"]
```

兩者皆為同步函式，直接回傳陣列，不需要 `await`。

### 搭配天氣預報使用

`counties()` 回傳的名稱可直接作為 `locationName` 參數：

```ts
for (const county of locations.counties()) {
  const forecast = await client.forecast.getTownshipForecast({ locationName: county });
  // ...
}
```

### 注意事項

- **名稱一律使用「臺」而非「台」**（臺北市、臺中市、臺南市、臺東縣），與 CWA API 一致。SDK 不會自動轉換寫法，`townships("台北市")` 會回傳空陣列而非拋出錯誤。若縣市名稱來自使用者輸入或外部系統，請在呼叫前自行正規化。
- **排列順序**取自 CWA [縣市鄉鎮對照表](https://opendata.cwa.gov.tw/opendatadoc/Opendata_City.pdf) 附錄 A，大致由北而南、本島至離島，直接用於選單即為合理順序。
- **鄉鎮名稱在跨縣市時可能重複**（如 `中正區`、`信義區`、`東區`），因此判斷鄉鎮時請一併帶上縣市。
- 回傳的皆為**新陣列**，呼叫端可安全地 `sort()` 或 `filter()`，不會影響 SDK 內部資料。

TypeScript 使用者可另外匯入 `TaiwanCounty` 型別：

```ts
import { locations, type TaiwanCounty } from "@open-tw/cwa-sdk";

function pick(county: TaiwanCounty) {
  return locations.townships(county);
}
```

由於 `townships()` 的參數型別為 `TaiwanCounty`，若縣市名稱來自 API 回應、網址參數等 `string` 來源，需自行收窄型別後再傳入。

## API 涵蓋範圍

> 目前為初期開發階段，API 涵蓋範圍會持續擴充，進度請參考 [Roadmap](#roadmap)。

| 分類         | 說明                          | 狀態      |
| ------------ | ----------------------------- | --------- |
| 行政區資料   | 縣市與鄉鎮市區對照表（本地）  | ✅ 可用   |
| 一般天氣預報 | 36 小時天氣預報、鄉鎮天氣預報 | 🚧 開發中 |
| 地震資料     | 顯著有感地震報告              | 📋 規劃中 |
| 降雨與觀測   | 自動氣象站觀測資料            | 📋 規劃中 |
| 天氣特報     | 颱風、豪雨等特報資訊          | 📋 規劃中 |

## Roadmap

- [ ] 天氣預報 endpoints
- [ ] 地震資料 endpoints
- [ ] 觀測資料 endpoints
- [ ] 天氣特報 endpoints
- [ ] 文件站（API Reference）
- [ ] React Hooks 子套件

## 授權

[MIT](./LICENSE)

## 貢獻

歡迎透過 [Issue](https://github.com/open-tw/cwa-sdk/issues) 回報問題或提出建議。
