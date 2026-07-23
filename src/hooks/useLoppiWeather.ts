import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LoppiWeather, WeatherStatus } from "../services/weather/weatherTypes";
import { fetchLoppiWeather, FALLBACK_LOPPI_WEATHER } from "../services/weather/weatherService";
import {
  CabinEnvironment,
  mapWeatherToCabinEnvironment,
  getAuroraWeatherGreeting,
} from "../core/environment/CabinEnvironmentEngine";

export function useLoppiWeather() {
  const [weather, setWeather] = useState<LoppiWeather | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("idle");
  const [isStale, setIsStale] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const weatherRef = useRef<LoppiWeather | null>(null);
  weatherRef.current = weather;

  const loadWeather = useCallback(async (force = false) => {
    if (force) {
      setIsRefreshing(true);
    } else if (!weatherRef.current) {
      setStatus("loading");
    }

    try {
      const res = await fetchLoppiWeather(force);
      setWeather(res.weather);
      setIsStale(res.isStale);
      setStatus(res.isStale ? "stale" : "success");
    } catch {
      if (!weatherRef.current) {
        setWeather(FALLBACK_LOPPI_WEATHER);
      }
      setStatus("error");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(false);

    // Refresh every 20 minutes
    const interval = setInterval(() => {
      loadWeather(true);
    }, 20 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadWeather]);

  const cabinEnvironment: CabinEnvironment = useMemo(
    () => mapWeatherToCabinEnvironment(weather),
    [weather]
  );

  const auroraGreeting: string = useMemo(
    () => getAuroraWeatherGreeting(weather),
    [weather]
  );

  const formattedWeather: string = useMemo(() => {
    if (!weather) return "Loppi";
    return `${weather.condition}, ${weather.temperatureC}°C`;
  }, [weather]);

  const refreshWeather = useCallback(() => {
    loadWeather(true);
  }, [loadWeather]);

  return {
    weather,
    status,
    isStale,
    isRefreshing,
    refreshWeather,
    cabinEnvironment,
    auroraGreeting,
    formattedWeather,
  };
}

