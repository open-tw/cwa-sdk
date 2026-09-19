/**
 * F-C0032-001 一般天氣預報-今明36小時天氣預報
 * 對應官方 API 的「原始」回傳格式（未經轉換）
 */

/**
 * 鄉鎮天氣預報的時間範圍。
 * - "3days"：未來 3 天天氣預報
 * - "1week"：未來 1 週天氣預報
 */
export type TownshipForecastRange = "3days" | "1week";

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

export interface Get36HourForecastParams {
  /** 指定縣市，省略則回傳全部 22 縣市 */
  locationName?: TaiwanCounty;
}

export interface GetTownshipForecastParams {
  /** 指定縣市，決定要查詢哪一個 dataset */
  county: TaiwanCounty;
  /** 時間範圍，預設 "3days" */
  range?: TownshipForecastRange;
  /** 指定鄉鎮市區，省略則回傳該縣市全部鄉鎮 */
  locationName?: string;
}

/**
 * F-D0047 鄉鎮天氣預報的 records 結構。
 *
 * 與 F-C0032-001 有兩個重大差異，串接時請特別注意：
 * 1. 欄位命名為 PascalCase（Locations、WeatherElement），而非 camelCase
 * 2. 多了一層 Locations（縣市）再包 Location（鄉鎮）
 */
export interface TownshipForecastRecords {
  Locations: RawTownshipLocations[];
}

export interface RawTownshipLocations {
  DatasetDescription: string;
  /** 縣市名稱，例如「宜蘭縣」 */
  LocationsName: string;
  /** 資料集代碼，例如「D0047-001」 */
  Dataid: string;
  Location: RawTownshipLocation[];
}

export interface RawTownshipLocation {
  /** 鄉鎮市區名稱，例如「宜蘭市」 */
  LocationName: string;
  /** 行政區代碼，例如「10002010」 */
  Geocode: string;
  /** 注意：官方回傳為字串，非 number */
  Latitude: string;
  Longitude: string;
  WeatherElement: RawTownshipWeatherElement[];
}

/**
 * 天氣要素名稱。注意官方使用中文，而非 F-C0032-001 的 Wx / PoP 等代碼。
 *
 * 3 天與 1 週兩種預報的要素不同，故分開定義。
 * 皆以宜蘭縣（F-D0047-001 / -003）實際回傳為準。
 */
export type TownshipElementName =
  | Township3DaysElementName
  | Township1WeekElementName;

/** 3 天預報（F-D0047-001）的天氣要素 */
export type Township3DaysElementName =
  | "溫度"
  | "露點溫度"
  | "相對濕度"
  | "體感溫度"
  | "舒適度指數"
  | "風速"
  | "風向"
  | "3小時降雨機率"
  | "天氣現象"
  | "天氣預報綜合描述";

/**
 * 1 週預報（F-D0047-003）的天氣要素。
 *
 * 與 3 天版的差異：溫度、體感溫度、舒適度指數改為最高／最低兩個獨立要素，
 * 降雨機率改為 12 小時，並多了「紫外線指數」。
 */
export type Township1WeekElementName =
  | "平均溫度"
  | "最高溫度"
  | "最低溫度"
  | "平均露點溫度"
  | "平均相對濕度"
  | "最高體感溫度"
  | "最低體感溫度"
  | "最大舒適度指數"
  | "最小舒適度指數"
  | "風速"
  | "風向"
  | "12小時降雨機率"
  | "天氣現象"
  | "紫外線指數"
  | "天氣預報綜合描述";

export interface RawTownshipWeatherElement {
  ElementName: TownshipElementName;
  Time: RawTownshipTimeSlot[];
}

/**
 * 時間欄位有兩種形式：
 * - 瞬時值（DataTime）
 * - 區間值（StartTime / EndTime）
 *
 * 3 天預報兩種並存：溫度、露點溫度、相對濕度、體感溫度、舒適度指數、風速、風向
 * 為 DataTime，其餘為區間值。
 *
 * 1 週預報則「全部」為區間值，不會出現 DataTime。
 *
 * 判斷方式建議用 "DataTime" in slot，而非依賴 ElementName 或 range。
 */
export type RawTownshipTimeSlot =
  | RawTownshipInstantTime
  | RawTownshipIntervalTime;

export interface RawTownshipInstantTime {
  /** ISO 8601 含時區，例如 "2026-09-18T12:00:00+08:00" */
  DataTime: string;
  ElementValue: RawTownshipElementValue[];
}

export interface RawTownshipIntervalTime {
  StartTime: string;
  EndTime: string;
  ElementValue: RawTownshipElementValue[];
}

/**
 * ElementValue 的欄位依 ElementName 而異，所有值皆為字串。
 *
 * 3 天預報：
 * - 溫度 → Temperature
 * - 露點溫度 → DewPoint
 * - 相對濕度 → RelativeHumidity
 * - 體感溫度 → ApparentTemperature
 * - 舒適度指數 → ComfortIndex + ComfortIndexDescription
 * - 風速 → WindSpeed + BeaufortScale
 * - 風向 → WindDirection
 * - 3小時降雨機率 → ProbabilityOfPrecipitation
 * - 天氣現象 → Weather + WeatherCode
 * - 天氣預報綜合描述 → WeatherDescription
 *
 * 1 週預報：
 * - 平均溫度 → Temperature
 * - 最高溫度 → MaxTemperature
 * - 最低溫度 → MinTemperature
 * - 平均露點溫度 → DewPoint
 * - 平均相對濕度 → RelativeHumidity
 * - 最高體感溫度 → MaxApparentTemperature
 * - 最低體感溫度 → MinApparentTemperature
 * - 最大舒適度指數 → MaxComfortIndex + MaxComfortIndexDescription
 * - 最小舒適度指數 → MinComfortIndex + MinComfortIndexDescription
 * - 風速 → WindSpeed + BeaufortScale
 * - 風向 → WindDirection
 * - 12小時降雨機率 → ProbabilityOfPrecipitation
 * - 天氣現象 → Weather + WeatherCode
 * - 紫外線指數 → UVIndex + UVExposureLevel
 * - 天氣預報綜合描述 → WeatherDescription
 */
export interface RawTownshipElementValue {
  /** 3 天預報為「溫度」，1 週預報為「平均溫度」 */
  Temperature?: string;
  MaxTemperature?: string;
  MinTemperature?: string;
  /** 3 天預報為「露點溫度」，1 週預報為「平均露點溫度」 */
  DewPoint?: string;
  /** 3 天預報為「相對濕度」，1 週預報為「平均相對濕度」 */
  RelativeHumidity?: string;
  /** 僅 3 天預報 */
  ApparentTemperature?: string;
  /** 僅 1 週預報 */
  MaxApparentTemperature?: string;
  /** 僅 1 週預報 */
  MinApparentTemperature?: string;
  /** 僅 3 天預報 */
  ComfortIndex?: string;
  /** 僅 3 天預報 */
  ComfortIndexDescription?: string;
  /** 僅 1 週預報 */
  MaxComfortIndex?: string;
  /** 僅 1 週預報 */
  MaxComfortIndexDescription?: string;
  /** 僅 1 週預報 */
  MinComfortIndex?: string;
  /** 僅 1 週預報 */
  MinComfortIndexDescription?: string;
  WindSpeed?: string;
  /** 可能為 "<= 1" 等非純數值字串，勿直接 Number() */
  BeaufortScale?: string;
  WindDirection?: string;
  /** 可能為 "-"（表示該時段無資料），勿直接 Number() */
  ProbabilityOfPrecipitation?: string;
  /** 僅 1 週預報 */
  UVIndex?: string;
  /** 僅 1 週預報，例如「過量級」「高量級」 */
  UVExposureLevel?: string;
  Weather?: string;
  WeatherCode?: string;
  WeatherDescription?: string;
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
