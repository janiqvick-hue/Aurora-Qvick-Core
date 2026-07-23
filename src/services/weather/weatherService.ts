import { LoppiWeather } from "./weatherTypes";
import { mapWmoCodeToFinnish } from "./weatherCodeMapper";

const CACHE_KEY = "loppi_weather_cache_v1";
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes fetch cache
const STALE_THRESHOLD_MS = 60 * 60 * 1000; // 60 minutes stale limit

// Fixed location: Loppi, Kanta-Häme, Finland
export class LoppiCoordinates {
  static readonly LATITUDE = 60.7179;
  static readonly LONGITUDE = 24.4409;
  static readonly LOCATION_NAME = "Loppi, Kanta-Häme, Finland";
}

export const FALLBACK_LOPPI_WEATHER: LoppiWeather = {
  temperatureC: 4,
  apparentTemperatureC: 2,
  condition: "Kevyttä sadetta",
  conditionCode: 61,
  windSpeedKmh: 12,
  precipitationMm: 0.8,
  isDay: false,
  fetchedAt: new Date().toISOString(),
};

export function getCachedLoppiWeather(): { weather: LoppiWeather | null; isStale: boolean } {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { weather: null, isStale: false };

    const parsed: LoppiWeather = JSON.parse(raw);
    const fetchedTime = new Date(parsed.fetchedAt).getTime();
    const age = Date.now() - fetchedTime;

    return {
      weather: parsed,
      isStale: age > STALE_THRESHOLD_MS,
    };
  } catch {
    return { weather: null, isStale: false };
  }
}

export function saveLoppiWeatherToCache(weather: LoppiWeather): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(weather));
  } catch {
    // Ignore storage write errors
  }
}

export async function fetchLoppiWeather(forceRefresh = false): Promise<{
  weather: LoppiWeather;
  isFromCache: boolean;
  isStale: boolean;
}> {
  if (!forceRefresh) {
    const cached = getCachedLoppiWeather();
    if (cached.weather) {
      const age = Date.now() - new Date(cached.weather.fetchedAt).getTime();
      if (age < CACHE_TTL_MS) {
        return {
          weather: cached.weather,
          isFromCache: true,
          isStale: cached.isStale,
        };
      }
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LoppiCoordinates.LATITUDE}&longitude=${LoppiCoordinates.LONGITUDE}&current=temperature_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=Europe%2FHelsinki`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      throw new Error(`Weather service returned ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};

    const code = typeof current.weather_code === "number" ? current.weather_code : 3;
    const isDay = current.is_day === 1;

    const weather: LoppiWeather = {
      temperatureC: Math.round(current.temperature_2m ?? 4),
      apparentTemperatureC: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 4),
      condition: mapWmoCodeToFinnish(code, isDay),
      conditionCode: code,
      windSpeedKmh: Math.round((current.wind_speed_10m ?? 3) * 3.6),
      precipitationMm: current.precipitation ?? 0,
      isDay,
      fetchedAt: new Date().toISOString(),
    };

    saveLoppiWeatherToCache(weather);

    return {
      weather,
      isFromCache: false,
      isStale: false,
    };
  } catch (err) {
    const cached = getCachedLoppiWeather();
    if (cached.weather) {
      return {
        weather: cached.weather,
        isFromCache: true,
        isStale: true,
      };
    }

    // Return safe fallback weather
    return {
      weather: FALLBACK_LOPPI_WEATHER,
      isFromCache: false,
      isStale: true,
    };
  }
}
