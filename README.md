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

## API 涵蓋範圍

> 目前為初期開發階段，API 涵蓋範圍會持續擴充，進度請參考 [Roadmap](#roadmap)。

| 分類         | 說明                          | 狀態      |
| ------------ | ----------------------------- | --------- |
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

歡迎 Issue 與 PR！在送出 PR 前，請確認：

1. 已執行 `pnpm test` 且全數通過
2. 新增功能請附上對應測試
3. 遵循專案既有的 TypeScript 風格與錯誤處理慣例
