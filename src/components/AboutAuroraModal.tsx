import { X, Award, CheckCircle2, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";

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
        <div className="p-6 overflow-y-auto space-y-6 font-serif">
          {/* Aurora Core Concept */}
          <div className="bg-[#241a12]/70 border border-[#d4af37]/20 p-4 rounded-xl space-y-2">
            <h3 className="text-amber-300 font-semibold text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-amber-400" />
              Aurora Qvick Core Alpha 0.2
            </h3>
            <p className="text-xs text-stone-300 font-sans leading-relaxed font-light">
              Aurora on Qvick Gamesin luova tekoälykumppani, suunniteltu tueksi peli-ideointiin, Agile-projektinhallintaan ja syvälliseen tarinankerrontaan. Hän elää ja työskentelee suomalaisessa mökkimiljöössä takkatulen ja tyynen lake-maiseman äärellä.
            </p>
          </div>

          {/* Jani-Petteri Qvick Profile & Certificates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#3d2b1d] pb-2 text-[#d4af37]">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <h4 className="text-xs uppercase tracking-widest font-semibold">
                Jani-Petteri Qvick – Sertifikaatit & Pätevyydet
              </h4>
            </div>

            <p className="text-xs text-stone-400 font-sans italic">
              Jani-Petteri Qvick (jani.Qvick@gmail.com) on sertifioitu projektipäällikkö, pelisuunnittelija ja tekoälyosaaja.
            </p>

            <div className="space-y-2 text-xs font-sans">
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

              <div className="bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pelisuunnittelu, Tekoäly & C# -Osaaminen</span>
                </div>
                <ul className="text-[11px] text-stone-300 pl-5 space-y-1 list-disc font-light">
                  <li>Epic Games: Introduction to Game Design (1.7.2026)</li>
                  <li>Google: Accelerate Your Job Search with AI (1.7.2026)</li>
                  <li>Helsingin yliopisto & MinnaLearn: Elements of AI 2 ECTS (10.7.2026)</li>
                  <li>freeCodeCamp & Microsoft: Foundational C# Certification (13.7.2026)</li>
                </ul>
              </div>

              <div className="bg-[#140e09] border border-[#3d2b1d] p-3 rounded-lg space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Suoritetut Peliprojektit & Moduulit (Xamk / Unity / Unreal)</span>
                </div>
                <p className="text-[11px] text-stone-300 font-light leading-relaxed">
                  Mobile Game (Unity), Space Shooter (Unity), Sound Design (FMOD Studio), Unreal Engine Part 1 & 2 (Breakout 3D), Generative AI & Deeptech, Building a Game Brand (Qvick Games).
                </p>
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
