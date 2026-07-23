import { LoppiWeather } from "../../services/weather/weatherTypes";

export type CabinEnvironment =
  | "clear-day"
  | "clear-night"
  | "cloudy"
  | "rain"
  | "heavy-rain"
  | "snow"
  | "fog"
  | "thunder";

export function mapWeatherToCabinEnvironment(
  weather: LoppiWeather | null
): CabinEnvironment {
  if (!weather) return "rain";

  const code = weather.conditionCode;
  const isDay = weather.isDay;

  // Thunder
  if (code >= 95) return "thunder";

  // Snow
  if (code >= 71 && code <= 77) return "snow";
  if (code === 85 || code === 86) return "snow";

  // Heavy Rain
  if (code === 65 || code === 67 || code === 82) return "heavy-rain";

  // Rain
  if ((code >= 51 && code <= 63) || code === 80 || code === 81) return "rain";

  // Fog
  if (code === 45 || code === 48) return "fog";

  // Cloudy
  if (code === 2 || code === 3) return "cloudy";

  // Clear
  return isDay ? "clear-day" : "clear-night";
}

export function getAuroraWeatherGreeting(weather: LoppiWeather | null): string {
  if (!weather) {
    return "Mökki on lämmin ja tämän illan työtila on valmis.";
  }

  const env = mapWeatherToCabinEnvironment(weather);
  const temp = weather.temperatureC;

  switch (env) {
    case "rain":
    case "heavy-rain":
      return `Lopella sataa (${temp} °C). Sytytin takkaan tulen, niin mökissä on lämmintä.`;
    case "snow":
      return `Lopella sataa hiljalleen lunta (${temp} °C). Mökin työtila on lämmin ja valmis.`;
    case "clear-night":
      return `Lopella on selkeä ja kuulas ilta (${temp} °C). Järvi on tyyni ja takka hehkuu.`;
    case "clear-day":
      return `Lopella on kaunis ja selkeä päivä (${temp} °C). Valo heijastuu kauniisti järveltä.`;
    case "cloudy":
      return `Lopella on pilvistä (${temp} °C), mutta mökissä on lämmin ja kotoisa tunnelma.`;
    case "fog":
      return `Lopella usva leijuu järven yllä (${temp} °C). Sytytin kynttilät työpöydälle.`;
    case "thunder":
      return `Lopella jylisee ukkonen. Mökki tarjoaa turvallisen ja lämpimän suojan.`;
    default:
      return `Mökki on lämmin ja tämän illan työtila on valmis (${temp} °C).`;
  }
}
