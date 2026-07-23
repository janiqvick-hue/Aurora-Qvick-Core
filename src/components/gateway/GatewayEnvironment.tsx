import { memo } from "react";
import cabinLoginBg from "../../assets/images/cabin_login_bg_1784655680190.jpg";
import { CabinEnvironment } from "../../core/environment/CabinEnvironmentEngine";

interface GatewayEnvironmentProps {
  isUnlocking: boolean;
  cabinEnvironment?: CabinEnvironment;
}

export const GatewayEnvironment = memo(function GatewayEnvironment({
  isUnlocking,
  cabinEnvironment = "rain",
}: GatewayEnvironmentProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Primary Reference Image - Full Cabin Room with Lakeside Window, Fireplace, Desk & Seated Aurora */}
      <img
        src={cabinLoginBg}
        alt="Auroran mökkitoimisto"
        className="w-full h-full object-cover object-center transition-all duration-[2000ms] ease-out select-none"
        style={{
          filter: isUnlocking
            ? "brightness(0.1) blur(12px) contrast(1.2)"
            : cabinEnvironment === "clear-day"
            ? "brightness(0.95) contrast(1.02)"
            : cabinEnvironment === "fog"
            ? "brightness(0.8) contrast(0.95)"
            : "brightness(0.85) contrast(1.05)",
          transform: isUnlocking ? "scale(1.08)" : "scale(1)",
        }}
        referrerPolicy="no-referrer"
      />

      {/* Weather Lighting Tint Overlay */}
      {cabinEnvironment === "fog" && (
        <div className="absolute inset-0 bg-stone-300/10 backdrop-blur-[0.5px] pointer-events-none" />
      )}
      {cabinEnvironment === "clear-day" && (
        <div className="absolute inset-0 bg-amber-200/5 mix-blend-soft-light pointer-events-none" />
      )}
      {(cabinEnvironment === "rain" || cabinEnvironment === "heavy-rain") && (
        <div className="absolute inset-0 bg-blue-950/10 mix-blend-multiply pointer-events-none" />
      )}

      {/* Subtle Rain Layer outside window using CSS GPU animation */}
      {(cabinEnvironment === "rain" || cabinEnvironment === "heavy-rain") && (
        <div aria-hidden="true" className="absolute left-0 top-0 w-1/2 h-full opacity-30 pointer-events-none overflow-hidden">
          <div
            className={`w-full h-[200%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200/20 via-transparent to-transparent bg-[length:12px_24px] ${
              cabinEnvironment === "heavy-rain" ? "animate-heavy-rain-slide" : "animate-rain-slide"
            }`}
          />
        </div>
      )}

      {/* Subtle Snow Layer outside window using CSS GPU animation */}
      {cabinEnvironment === "snow" && (
        <div aria-hidden="true" className="absolute left-0 top-0 w-1/2 h-full opacity-35 pointer-events-none overflow-hidden">
          <div
            className="w-full h-[200%] bg-[radial-gradient(circle,_rgba(255,255,255,0.4)_1px,_transparent_1px)] bg-[size:24px_24px] animate-snow-slide"
          />
        </div>
      )}

      {/* Ambient Fireplace Dynamic Flame Glow on the Right */}
      <div
        className="absolute right-0 bottom-0 w-[55%] h-[80%] bg-gradient-radial from-amber-500/25 via-orange-600/10 to-transparent pointer-events-none mix-blend-screen animate-pulse"
        style={{ animationDuration: "3.5s" }}
      />

      {/* Dusk Lake Soft Gradient Sky Shading at Top */}
      <div className="absolute left-0 top-0 w-full h-[35%] bg-gradient-to-b from-[#060403]/80 via-[#060403]/20 to-transparent pointer-events-none" />

      {/* Very Soft Natural Vignette around outer edges */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-60" />

      {/* Subtle Dust / Ambient Warm Light Particles via CSS animate-pulse */}
      <div
        className="absolute right-12 bottom-24 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none mix-blend-screen animate-pulse"
        style={{ animationDuration: "6s" }}
      />
    </div>
  );
});


