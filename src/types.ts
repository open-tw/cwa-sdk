/**
 * F-C0032-001 一般天氣預報-今明36小時天氣預報
 * 對應官方 API 的「原始」回傳格式（未經轉換）
 */

/** 官方支援的縣市名稱，注意是「臺」不是「台」（例如 臺北市、臺中市、臺南市、臺東縣） */
export type TaiwanCounty =
  | "宜蘭縣"
  | "花蓮縣"
  | "臺東縣"
  | "澎湖縣"
  | "金門縣"
  | "連江縣"
  | "臺北市"
  | "新北市"
  | "桃園市"
  | "臺中市"
  | "臺南市"
  | "高雄市"
  | "基隆市"
  | "新竹縣"
  | "新竹市"
  | "苗栗縣"
  | "彰化縣"
  | "南投縣"
  | "雲林縣"
  | "嘉義縣"
  | "嘉義市"
  | "屏東縣";

export interface GetTownshipForecastParams {
  /** 指定縣市，省略則回傳全部 22 縣市 */
  locationName?: TaiwanCounty;
}

export interface CwaApiResponse<T> {
  /** 注意：官方回傳的是字串 "true"/"false"，不是 boolean */
  success: string;
  result: {
    resource_id: string;
    fields: Array<{ id: string; type: string }>;
  };
  records: T;
}

export interface ForecastRecords {
  datasetDescription: string;
  location: RawLocation[];
}

export interface RawLocation {
  locationName: string;
  weatherElement: RawWeatherElement[];
}

export type ForecastElementName = "Wx" | "PoP" | "MinT" | "MaxT" | "CI";

export interface RawWeatherElement {
  elementName: ForecastElementName;
  time: RawTimeSlot[];
}

export interface RawTimeSlot {
  /** 格式："2026-08-27 18:00:00"，非 ISO 8601，且未帶時區資訊 */
  startTime: string;
  endTime: string;
  parameter: RawParameter;
}

/**
 * 注意：這個介面的欄位語意會依 elementName 而不同：
 * - Wx: parameterName = 天氣描述文字, parameterValue = 天氣代碼
 * - PoP / MinT / MaxT: parameterName = 實際數值(字串), parameterUnit = 單位
 * - CI: 只有 parameterName（純文字描述），無 parameterValue / parameterUnit
 */
export interface RawParameter {
  parameterName: string;
  parameterValue?: string;
  parameterUnit?: string;
}
