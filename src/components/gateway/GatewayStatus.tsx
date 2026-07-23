import { useState, useEffect, memo } from "react";
import { Smile } from "lucide-react";
import { useLoppiWeather } from "../../hooks/useLoppiWeather";
import { LoppiWeatherStatus } from "../weather/LoppiWeatherStatus";

export const GatewayStatus = memo(function GatewayStatus() {
  const [currentTime, setCurrentTime] = useState("");
  const { weather, status, isRefreshing, refreshWeather, auroraGreeting } =
    useLoppiWeather();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);


  return (
    <header className="relative z-20 w-full px-6 md:px-12 pt-6 pb-2 flex items-start justify-between pointer-events-none">
      {/* Top Left: Logo & Gentle Welcome Text (Integrated into Room, No Cards) */}
      <div className="space-y-3 pointer-events-auto max-w-sm">
        {/* Logo */}
        <div className="drop-shadow-lg">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-ping"
              style={{ animationDuration: "3s" }}
            />
            <h1 className="font-serif italic font-medium text-lg md:text-xl text-amber-200/90 tracking-wider">
              AURORA QVICK CORE
            </h1>
          </div>
          <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#d4af37]/80 pl-4 -mt-0.5">
            Digitaalinen kumppani
          </p>
        </div>

        {/* Welcome Text resting on soft ambient background fade */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0c0704]/70 via-[#0c0704]/40 to-transparent backdrop-blur-xs space-y-1 drop-shadow-md border border-[#3d2b1d]/20">
          <h2 className="font-serif text-sm md:text-base font-medium text-amber-100/95 tracking-wide">
            Tervetuloa takaisin, Jani.
          </h2>
          <div className="font-serif text-xs text-stone-200/90 space-y-0.5 leading-relaxed font-light">
            <p>{auroraGreeting}</p>
          </div>
        </div>
      </div>

      {/* Top Right: Ambient Room Details (Discreet, No Big Bar) */}
      <div className="pointer-events-auto flex items-center gap-3 text-xs font-serif text-stone-200/90 drop-shadow-lg pt-1">
        {/* Real-time Loppi Weather */}
        <LoppiWeatherStatus
          weather={weather}
          status={status}
          isRefreshing={isRefreshing}
          onRefresh={refreshWeather}
        />

        {/* Emotion indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-amber-200/90 bg-[#0c0704]/50 px-3.5 py-1.5 rounded-full border border-[#3d2b1d]/35 backdrop-blur-xs">
          <Smile className="w-3.5 h-3.5 text-amber-400/90" />
          <span className="text-[11px] font-sans">Rauhallinen</span>
        </div>

        {/* Live Clock */}
        <div className="text-amber-200 font-mono text-xs tracking-wider bg-[#0c0704]/60 px-3.5 py-1.5 rounded-full border border-[#3d2b1d]/40 backdrop-blur-xs">
          🕒 {currentTime || "21:05"}
        </div>
      </div>
    </header>
  );
});


