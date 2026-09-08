import { ForecastResource } from "./resources/forecast.js";

export interface CwaClientOptions {
  apiKey: string;
}

export class CwaClient {
  readonly forecast: ForecastResource;

  constructor(options: CwaClientOptions) {
    this.forecast = new ForecastResource(options.apiKey);
  }
}
