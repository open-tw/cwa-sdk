/**
 * 所有 SDK 拋出的錯誤都繼承自這個基底類別，
 * 方便使用者用 `instanceof CwaApiError` 做粗粒度的錯誤捕捉。
 */
export class CwaApiError extends Error {
  /** 原始 HTTP status code，若有的話 */
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "CwaApiError";
    this.status = status;
  }
}

/** API Key 缺失、無效或已過期（HTTP 401） */
export class CwaAuthError extends CwaApiError {
  constructor(status: number) {
    super("CWA API Key 無效或已過期，請確認 Authorization 是否正確", status);
    this.name = "CwaAuthError";
  }
}

/** 超過呼叫頻率限制（HTTP 429） */
export class CwaRateLimitError extends CwaApiError {
  constructor(status: number) {
    super("已超過 CWA API 呼叫頻率限制，請稍後再試", status);
    this.name = "CwaRateLimitError";
  }
}

/** 找不到指定的 dataset（HTTP 404），通常是 dataset ID 打錯 */
export class CwaNotFoundError extends CwaApiError {
  constructor(status: number, datasetId: string) {
    super(`找不到 dataset "${datasetId}"，請確認代碼是否正確`, status);
    this.name = "CwaNotFoundError";
  }
}

/** 其他未分類的 API 錯誤（5xx、非預期狀態碼等） */
export class CwaUnknownError extends CwaApiError {
  constructor(status: number, statusText: string) {
    super(`CWA API 發生未預期的錯誤：${status} ${statusText}`, status);
    this.name = "CwaUnknownError";
  }
}

/** 官方回傳的 JSON 結構與預期不符時拋出（例如缺少某個 weatherElement） */
export class CwaParseError extends CwaApiError {
  constructor(message: string) {
    super(message);
    this.name = "CwaParseError";
  }
}
