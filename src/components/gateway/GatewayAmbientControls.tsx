import { memo } from "react";
import { Settings, Sun, BookOpen } from "lucide-react";

interface GatewayAmbientControlsProps {
  onOpenSettings: () => void;
  onOpenSummary: () => void;
  onOpenMemories: () => void;
}

export const GatewayAmbientControls = memo(function GatewayAmbientControls({
  onOpenSettings,
  onOpenSummary,
  onOpenMemories,
}: GatewayAmbientControlsProps) {

  return (
    <footer className="relative z-20 w-full px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Soft Atmosphere Note */}
      <p className="text-[11px] font-serif italic text-stone-300/80 text-center sm:text-left drop-shadow-md">
        "Mökki on hiljainen. Lämmin valo loistaa ikkunoista. Aurora odottaa sinua."
      </p>

      {/* Engraved Brass/Wood Pill Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a0f08]/80 hover:bg-[#28180d] border border-[#8a6845]/45 hover:border-[#d4af37]/70 text-xs font-serif text-amber-200/90 rounded-full transition-all cursor-pointer shadow-md backdrop-blur-xs active:scale-95"
        >
          <Settings className="w-3.5 h-3.5 text-amber-400/90" />
          <span>Asetukset</span>
        </button>

        <button
          onClick={onOpenSummary}
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a0f08]/80 hover:bg-[#28180d] border border-[#8a6845]/45 hover:border-[#d4af37]/70 text-xs font-serif text-amber-200/90 rounded-full transition-all cursor-pointer shadow-md backdrop-blur-xs active:scale-95"
        >
          <Sun className="w-3.5 h-3.5 text-amber-400/90" />
          <span>Päivän yhteenveto</span>
        </button>

        <button
          onClick={onOpenMemories}
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a0f08]/80 hover:bg-[#28180d] border border-[#8a6845]/45 hover:border-[#d4af37]/70 text-xs font-serif text-amber-200/90 rounded-full transition-all cursor-pointer shadow-md backdrop-blur-xs active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400/90" />
          <span>Muistit</span>
        </button>
      </div>
    </footer>
  );
});

