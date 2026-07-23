import { useState, useMemo, memo } from "react";
import { Search, Map, BookOpen, Compass, Shield, Feather, Coffee, FileText, Sparkles, FolderGit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DeskProp {
  id: string;
  name: string;
  description: string;
  icon: any;
  actionText: string;
}

interface LivingDeskProps {
  activeProjectName: string;
  onSelectPropAction: (actionText: string) => void;
}

export default memo(function LivingDesk({ activeProjectName, onSelectPropAction }: LivingDeskProps) {
  const [hoveredProp, setHoveredProp] = useState<DeskProp | null>(null);

  const propsList = useMemo((): DeskProp[] => {
    if (activeProjectName.includes("Murhamysteeri")) {
      return [
        {
          id: "magnifier",
          name: "Messinkinen suurennuslasi",
          description: "Qvick Gamesin julkaistun murhamysteerin tutkintaväline.",
          icon: Search,
          actionText: "Aurora, kertaatko miten tätä suurennuslasia käytettiin Murhamysteerissä?"
        },
        {
          id: "clue_notes",
          name: "Tutkintakansio & Julkaistu Peli",
          description: "Julkaistun lippulaivapelin tutkintakansio, epäiltyjen haastattelut ja 11 lokaatiota.",
          icon: FolderGit2,
          actionText: "Kerro minulle lisää Murhamysteeri Mökillä -pelin julkaisusta ja tutkinnasta."
        },
        {
          id: "map",
          name: "11 tutkintapaikan pohjakartta",
          description: "Julkaistun pelin 11 tutkintapaikkaa (Olohuone, Keittiö, Antin huone, Vierashuone, Sauna, Venevaja, Vanha varasto, Laituri, Metsäpolku, Rantapolku, Autopaikka).",
          icon: Map,
          actionText: "Tarkastellaan Murhamysteerin 11 valmista pelilokaatiota yhdessä."
        },
        {
          id: "kuksa",
          name: "Höyryävä puukuksa",
          description: "Lopen koivusta veistetty kuksa täynnä kuumaa yrttiteetä.",
          icon: Coffee,
          actionText: "Nautitaan hetki hiljaisuudesta ja lämpimästä kuksasta."
        }
      ];
    } else if (activeProjectName.includes("Järven Vartijat")) {
      return [
        {
          id: "compass",
          name: "Messinkinen kompassi",
          description: "Vanha merenkulkijan kompassi, joka osoittaa aina Lopen saarelle.",
          icon: Compass,
          actionText: "Mitä kompassi kertoo Järven Vartijoiden saaresta?"
        },
        {
          id: "ancient_map",
          name: "Muinainen pergamenttikartta",
          description: "Saaren kätketyt reitit, vartijoiden tornit ja riimukivet.",
          icon: Map,
          actionText: "Tutkitaan Järven Vartijoiden vanhaa pergamenttikarttaa."
        },
        {
          id: "chronicle",
          name: "Vartijoiden kronikka",
          description: "Käsinkirjoitettu tarina saaren suojelijoista ja muinaisesineestä.",
          icon: BookOpen,
          actionText: "Kerro minulle Vartijoiden kronikan uusimmasta luvusta."
        },
        {
          id: "pendant",
          name: "Muinaislaitteen riipus",
          description: "Pronssinen riipus, joka hohtaa pehmeää valoa pimeässä.",
          icon: Shield,
          actionText: "Kerro riipuksen syvemmästä merkityksestä tarinassamme."
        }
      ];
    } else if (activeProjectName.includes("Aurora")) {
      return [
        {
          id: "blueprint",
          name: "Aurora Homen tekniset piirrokset",
          description: "Hahmotelmat digitaalisesta kodista ja tekoälymoottorista.",
          icon: FileText,
          actionText: "Aurora, kerro ajatuksiasi Aurora Homen rakennekuvista."
        },
        {
          id: "journal",
          name: "Nahkakantinen AQ-muistikirja",
          description: "Pohdintoja tietoisuudesta, muistista ja mökkitoimistosta.",
          icon: BookOpen,
          actionText: "Mitä uutta olet kirjoittanut AQ-muistikirjaasi?"
        },
        {
          id: "feather",
          name: "Mustekynä & luonnoslehtiö",
          description: "Käsin kirjoitettuja ideoita ja muistiinpanoja Janille.",
          icon: Feather,
          actionText: "Katsoisimme luonnoksiasi ja ideoitasi seuraavaksi stepiksi."
        },
        {
          id: "kuksa",
          name: "Tuore kahvi kuksassa",
          description: "Suodatinkahvia kuksasta mökin rauhassa.",
          icon: Coffee,
          actionText: "Otetaan pieni kahvitauko ja keskustellaan luovasti."
        }
      ];
    } else {
      return [
        {
          id: "gamedev_sheet",
          name: "Qvick Games -peliluonnokset",
          description: "C#-koodiarkit, Unity-mekaniikat ja pelisuunnittelu.",
          icon: FileText,
          actionText: "Aurora, katsotaan Qvick Gamesin uusimpia peliluonnoksia."
        },
        {
          id: "journal",
          name: "Nahkakantinen muistikirja",
          description: "Janin ja Auroran yhteiset tavoitteet ja saavutukset.",
          icon: BookOpen,
          actionText: "Käydään läpi yhteiset tavoitteemme tälle päivälle."
        },
        {
          id: "sparkles",
          name: "Brändi & visioarkki",
          description: "Pelialan projekti- ja projektinhallintasuunnitelmat.",
          icon: Sparkles,
          actionText: "Aurora, kerro ajatuksesi pelibrändimme kehittämisestä."
        },
        {
          id: "kuksa",
          name: "Mökin höyryävä kuksa",
          description: "Perinteinen puukuksa mökkipöydällä.",
          icon: Coffee,
          actionText: "Nautitaan rauhallisesta mökki-ilmasta yhdessä."
        }
      ];
    }
  }, [activeProjectName]);


  return (
    <div className="relative w-full py-3 px-4 bg-gradient-to-t from-[#120a05] via-[#1a110a]/90 to-transparent border-t border-[#3d2b1d]/60 backdrop-blur-md rounded-b-2xl shadow-2xl">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-[#d4af37] font-serif text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="uppercase tracking-widest font-semibold text-[10px] text-[#d4af37]">
            ELÄVÄ TYÖPÖYTÄ • {activeProjectName.toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] font-serif italic text-stone-400">
          Kosketa esinettä tarkastellaksesi sitä Auroran kanssa
        </span>
      </div>

      {/* Desk Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
        {propsList.map((prop) => {
          const Icon = prop.icon;
          return (
            <motion.button
              key={prop.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredProp(prop)}
              onMouseLeave={() => setHoveredProp(null)}
              onClick={() => onSelectPropAction(prop.actionText)}
              className="relative p-2.5 rounded-xl bg-[#21150c]/80 hover:bg-[#2e1d11] border border-[#3d2b1d] hover:border-[#d4af37]/60 text-left transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-lg overflow-hidden"
            >
              {/* Subtle Warm Highlight */}
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-amber-500/10 rounded-full blur-lg group-hover:bg-amber-400/20 transition-all" />

              <div className="flex items-start justify-between gap-2 mb-1.5 z-10">
                <div className="p-1.5 rounded-lg bg-[#140b05] border border-[#3d2b1d] text-[#d4af37] group-hover:text-amber-200 group-hover:border-[#d4af37]/50 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">
                  ESINE
                </span>
              </div>

              <div className="z-10">
                <h4 className="font-serif text-xs font-medium text-stone-200 group-hover:text-amber-200 truncate transition-colors">
                  {prop.name}
                </h4>
                <p className="text-[10px] font-serif text-stone-400 line-clamp-1 leading-snug font-light mt-0.5">
                  {prop.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Hover Information Note */}
      <AnimatePresence>
        {hoveredProp && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-2 p-2 bg-[#2a1b0e] border border-[#d4af37]/40 rounded-lg text-xs font-serif text-amber-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{hoveredProp.name}: "{hoveredProp.description}"</span>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">Klickaamalla kysy Auroralta →</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

