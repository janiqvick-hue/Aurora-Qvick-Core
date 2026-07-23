import { useState, useRef, FormEvent, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Sparkles, HelpCircle } from "lucide-react";
import { validateAccessCode } from "../../core/auth/validateAccessCode";

interface CabinAccessJournalProps {
  onSuccess: () => void;
  isUnlocking: boolean;
}

export const CabinAccessJournal = memo(function CabinAccessJournal({
  onSuccess,
  isUnlocking,
}: CabinAccessJournalProps) {

  const [accessCode, setAccessCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Automatically focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isUnlocking) return;

    if (validateAccessCode(accessCode)) {
      setErrorMsg(null);
      onSuccess();
    } else {
      setErrorMsg("Pääsykoodi ei avannut ovea.");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputChange = (val: string) => {
    setAccessCode(val);
    if (errorMsg) {
      setErrorMsg(null);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-auto flex flex-col items-center justify-end pb-4 md:pb-8 select-none">
      {/* Soft Ambient Cast Shadow onto Wooden Desk Surface */}
      <div className="absolute -bottom-5 left-6 right-6 h-10 bg-[#080402]/90 blur-xl rounded-full pointer-events-none" />

      {/* Horizontal Leather Bound Access Notebook resting on desk */}
      <motion.div
        initial={{ opacity: 0, y: 35, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className={`w-full bg-gradient-to-b from-[#2a1a0f]/95 via-[#1d1109]/95 to-[#130803]/95 border rounded-2xl p-6 md:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.88)] relative transition-all duration-300 backdrop-blur-md transform hover:scale-[1.01] ${
          errorMsg
            ? "border-rose-900/80 shadow-[0_0_25px_rgba(225,29,72,0.2)]"
            : "border-[#8a6845]/45 hover:border-[#a88256]/65"
        }`}
      >
        {/* Brass Ring Spine on Left Side */}
        <div className="absolute -left-3 top-6 bottom-6 w-3 bg-[#0d0603] border-y border-l border-[#8a6845]/50 rounded-l-md flex flex-col justify-around py-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-full h-1 bg-gradient-to-r from-[#d4af37]/80 to-[#8a6845]/40 rounded-full"
            />
          ))}
        </div>

        {/* Interior Notebook Content */}
        <div className="text-center space-y-5">
          {/* Notebook Header Title */}
          <div>
            <h3 className="font-serif text-base md:text-lg font-medium text-amber-200/95 tracking-wide">
              Anna pääsykoodi
            </h3>
          </div>

          {/* Form with Password Input Line */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative mx-2">
              <label htmlFor="passcode-input" className="sr-only">
                Anna pääsykoodi
              </label>

              {/* Single Underline Style Input - No Box, No Placeholder */}
              <input
                id="passcode-input"
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={accessCode}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`w-full bg-transparent text-center text-base md:text-lg font-mono tracking-[0.25em] text-amber-100 border-b-2 py-2 px-8 transition-all duration-300 focus:outline-none ${
                  errorMsg
                    ? "border-rose-600/80 text-rose-200"
                    : "border-[#8a6845]/60 focus:border-[#d4af37] focus:drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
                }`}
                autoComplete="off"
                disabled={isUnlocking}
              />

              {/* Eye Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Piilota pääsykoodi" : "Näytä pääsykoodi"}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-300 transition-colors p-1 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quiet Error or Safe Hint Area */}
            <div aria-live="polite" className="min-h-[22px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {errorMsg ? (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-rose-300/90 font-serif text-xs italic text-center"
                  >
                    {errorMsg}
                  </motion.p>
                ) : showHint ? (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-amber-200/95 font-serif text-[11px] italic text-center"
                  >
                    💡 Auroran nimi ja projektin aloitusvuosi.
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Handcrafted Engraved Wood Plaque Button */}
            <div className="pt-1 flex justify-center">
              <button
                type="submit"
                disabled={isUnlocking}
                className="w-full max-w-[220px] relative py-2.5 px-6 bg-gradient-to-r from-[#382314] via-[#4d321d] to-[#382314] border border-[#a88256]/50 hover:border-[#d4af37]/80 text-amber-200/95 hover:text-amber-100 font-serif text-xs tracking-wider font-medium rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] active:scale-[0.97] transition-all cursor-pointer overflow-hidden flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]/80" />
                <span>Astu sisään</span>
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]/80" />
              </button>
            </div>

            {/* Passcode Hint Link */}
            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-[11px] font-serif text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3 h-3 text-stone-400" />
                <span>{showHint ? "Piilota vihje" : "Unohditko koodin?"}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
});

