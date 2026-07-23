import { memo } from "react";
import { CloudRain, Sun, Cloud, Snowflake, CloudLightning, CloudFog, RefreshCw } from "lucide-react";
import { LoppiWeather } from "../../services/weather/weatherTypes";

interface LoppiWeatherStatusProps {
  weather: LoppiWeather | null;
  status: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const LoppiWeatherStatus = memo(function LoppiWeatherStatus({
  weather,
  status,
  isRefreshing,
  onRefresh,
}: LoppiWeatherStatusProps) {

  if (status === "loading" && !weather) {
    return (
      <div className="flex items-center gap-2 text-xs font-serif text-amber-200/80 bg-[#0c0704]/50 px-3.5 py-1.5 rounded-full border border-[#3d2b1d]/30 backdrop-blur-xs">
        <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span className="text-[11px] font-sans">Loppi · Haetaan säätä...</span>
      </div>
    );
  }

  const w = weather || {
    temperatureC: 4,
    condition: "Kevyttä sadetta",
    conditionCode: 61,
    isDay: false,
  };

  const code = w.conditionCode;

  // Icon mapping
  const getWeatherIcon = () => {
    if (code >= 95) return <CloudLightning className="w-3.5 h-3.5 text-amber-300" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-3.5 h-3.5 text-blue-200" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-3.5 h-3.5 text-amber-400/90" />;
    if (code === 45 || code === 48) return <CloudFog className="w-3.5 h-3.5 text-stone-300" />;
    if (code === 2 || code === 3) return <Cloud className="w-3.5 h-3.5 text-stone-300" />;
    return w.isDay ? (
      <Sun className="w-3.5 h-3.5 text-amber-400" />
    ) : (
      <Cloud className="w-3.5 h-3.5 text-amber-200/80" />
    );
  };

  return (
    <div
      className="group relative flex items-center gap-2 text-xs font-serif text-stone-200/90 bg-[#0c0704]/50 px-3.5 py-1.5 rounded-full border border-[#3d2b1d]/35 backdrop-blur-xs transition-colors hover:border-[#d4af37]/40 shadow-sm"
      title={`Lopen sää: ${w.condition}, lämpötila ${w.temperatureC} °C`}
    >
      {getWeatherIcon()}

      <span className="text-[11px] font-sans font-medium">
        Loppi · {w.condition} · {w.temperatureC} °C
      </span>

      {/* Manual Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        type="button"
        aria-label="Päivitä Lopen sää"
        className="ml-0.5 p-0.5 rounded-full text-stone-400 hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
      </button>

      {/* Hidden Live Region for Screen Readers */}
      <span aria-live="polite" className="sr-only">
        Lopen sää päivitetty: {w.condition}, {w.temperatureC} astetta.
      </span>
    </div>
  );
});

