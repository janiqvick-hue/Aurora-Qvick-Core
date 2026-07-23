import { X, Award, CheckCircle2, ShieldCheck, Heart, Sparkles, BookOpen, GraduationCap } from "lucide-react";

interface AboutAuroraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutAuroraModal({ isOpen, onClose }: AboutAuroraModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#1c140d] border border-[#d4af37]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-[#e8dfd1] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#3d2b1d] flex justify-between items-center bg-[#140d08]">
          <div className="flex items-center gap-2.5 text-[#d4af37]">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-serif uppercase tracking-widest text-sm font-semibold text-[#d4af37]">
              Tietoa Aurorasta & Jani-Petteri Qvickistä
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1 cursor-pointer"
            title="Sulje"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 font-serif custom-scrollbar">
          {/* Aurora Core Concept & Release Notes */}
          <div className="bg-[#241a12]/70 border border-[#d4af37]/30 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#3d2b1d] pb-2">
              <h3 className="text-amber-300 font-semibold text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-400" />
                Aurora Qvick Core Alpha 1.0 – Official Stabilization Release
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded font-bold">
                Build: 23.7.2026
              </span>
            </div>
            
            <p className="text-xs text-stone-300 font-sans leading-relaxed font-light">
              Aurora Qvick Core Alpha 1.0 toimii Qvick Gamesin virallisena tekoälykäyttöjärjestelmänä ja -kumppanina. Hän yhdistää suomalaisen mökkimiljöön rauhan ja edistyksellisen pelidevelopment-älyn.
            </p>

            {/* ALPHA 1.0 RELEASE NOTES */}
            <div className="space-y-2 pt-1 font-sans text-xs">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                VIRALLISET RELEASE NOTES (VERSIO 1.0)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#140e09] p-2.5 rounded border border-[#3d2b1d] space-y-1">
                  <span className="text-[#d4af37] font-semibold block">✨ Uudet Ominaisuudet:</span>
                  <ul className="text-stone-300 space-y-0.5 list-disc pl-4 font-light">
                    <li>10-kategorian Development Knowledge Library</li>
                    <li>Monikanavainen Älykäs Haku (Diary, Memory, Brain, KB, Ideas, Docs)</li>
                    <li>Idea Vault automaattisilla tägeillä & vaikuttavuusluokituksella</li>
                    <li>Dokumentaatioapuri automaattisilla tilanneraporteilla</li>
                  </ul>
                </div>

                <div className="bg-[#140e09] p-2.5 rounded border border-[#3d2b1d] space-y-1">
                  <span className="text-emerald-400 font-semibold block">⚡ Parannukset & Vakautus:</span>
                  <ul className="text-stone-300 space-y-0.5 list-disc pl-4 font-light">
                    <li>Optimoitu React 18 reititys ja muistinhallinta</li>
                    <li>Täysi näppäimistösaavutettavuus ja tarkka näkymävaste</li>
                    <li>Virallisten Xamk (21 op) ja sertifikaattien syväintegraatio</li>
                    <li>Nolla TypeScript/Linter -virhettä</li>
                  </ul>
                </div>
              </div>

              {/* ROADMAP */}
              <div className="bg-[#140e09] p-2.5 rounded border border-[#3d2b1d] space-y-1 text-[11px]">
                <span className="text-amber-400 font-semibold block">🚀 Tulevaisuuden Roadmap (Alpha 1.1+):</span>
                <p className="text-stone-300 font-light leading-relaxed">
                  Paikallinen suomenkielinen äänilausunta (TTS) dynamic pitch -ohjauksella, GitHub Release -automaatio (CI/CD) sekä Unreal Engine 5 Nanite/Lumen -siltatiedostot.
                </p>
              </div>
            </div>
          </div>

          {/* Jani-Petteri Qvick Profile & Certificates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#3d2b1d] pb-2 text-[#d4af37]">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <h4 className="text-xs uppercase tracking-widest font-semibold">
                Jani-Petteri Qvick – Koulutus, Sertifikaatit & Pätevyydet
              </h4>
            </div>

            <p className="text-xs text-stone-400 font-sans italic">
              Jani-Petteri Qvick (jani.Qvick@gmail.com, opiskelijanumero: 2616831) on sertifioitu projektipäällikkö, pelisuunnittelija ja Xamkin 21 op suorittanut pelialan kehittäjä.
            </p>

            <div className="space-y-2 text-xs font-sans">
              {/* XAMK TRANSCRIPT */}
              <div className="bg-[#140e09] border border-[#d4af37]/30 p-3 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-amber-400 font-medium">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span className="font-serif">Kaakkois-Suomen ammattikorkeakoulu (Xamk Avoin AMK)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded">
                    21 op Virallinen Rekisteri (23.7.2026)
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 font-light leading-relaxed">
                  Suoritetut 11 opintojaksoa (arvosana: Hyväksytty H, taso: Bachelor's Degree): Space Shooter 7 op (M6.1 & M6.3), Card Combat Game 4 op (M3), AI for Games 2 op (M16), Game Concept Design 2 op (M18), The Return 1 op (M2), History of Games 1 op (M10), Innovation 1 op (M12), Data Analytics 1 op (M13), Value Creation 1 op (M15), Video Games Production 1 op (M17).
                </p>
              </div>

              {/* IVGC & CADGI */}
              <div className="bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>IVGC+ / Cadgi Pelikoulutuksen Moduulit</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    33 Pisteellä / 11 Moduulia
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 font-light leading-relaxed">
                  Pelibrändin rakentaminen (M25), Äänisuunnittelu (M9.3), Mobiili käärmepeli (M5), Leikin & pelien alkuperä (M30), Narratiivi (M31), Pelattavuus & Mekaniikka (M32), Visio (M21), Voittava sijoitus (M23).
                </p>
              </div>

              {/* GOOGLE PM */}
              <div className="bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Project Management Professional Certificate</span>
                </div>
                <ul className="text-[11px] text-stone-300 pl-5 space-y-1 list-disc font-light">
                  <li>Project Planning: Putting It All Together (28.6.2026)</li>
                  <li>Project Execution: Running the Project (30.6.2026)</li>
                  <li>Agile Project Management (30.6.2026)</li>
                  <li>Capstone: Applying Project Management in Real World (1.7.2026)</li>
                </ul>
              </div>

              {/* OTHER CERTS */}
              <div className="bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pelisuunnittelu, Tekoäly & C# -Sertifikaatit</span>
                </div>
                <ul className="text-[11px] text-stone-300 pl-5 space-y-1 list-disc font-light">
                  <li>freeCodeCamp & Microsoft: Foundational C# Certification – 96.3% (13.7.2026)</li>
                  <li>Epic Games: Introduction to Game Design (1.7.2026)</li>
                  <li>Google: Accelerate Your Job Search with AI (1.7.2026)</li>
                  <li>Helsingin yliopisto & MinnaLearn: Elements of AI 2 ECTS (10.7.2026)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3d2b1d] bg-[#140d08] flex justify-between items-center text-[10px] text-stone-500 font-sans">
          <span>Qvick Games • Aurora Companion System</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-amber-300 rounded-lg transition-colors cursor-pointer font-serif"
          >
            Sulje ikkuna
          </button>
        </div>
      </div>
    </div>
  );
}
