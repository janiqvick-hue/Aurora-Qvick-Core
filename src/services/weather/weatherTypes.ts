export type LoppiWeather = {
  temperatureC: number;
  apparentTemperatureC?: number;
  condition: string;
  conditionCode: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
  isDay: boolean;
  fetchedAt: string;
};

export type WeatherStatus =
  | "idle"
  | "loading"
  | "success"
  | "stale"
  | "error";
