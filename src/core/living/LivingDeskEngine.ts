export interface DeskPropItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  actionPrompt: string;
  unityPrefabName: string; // Ready for Unity 3D / VR scene instantiation
  transform3D: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}

export interface DeskState {
  projectName: string;
  props: DeskPropItem[];
  deskSurfaceTexture: string; // e.g. "loppi_pine_wood"
  lightingGlowColor: string;
}

export const DESK_CONFIGURATIONS: Record<string, DeskPropItem[]> = {
  "Murhamysteeri Mökillä": [
    {
      id: "magnifier",
      name: "Messinkinen suurennuslasi",
      description: "Qvick Gamesin julkaistun murhamysteerin tutkintaväline.",
      iconName: "search",
      actionPrompt: "Aurora, kertaatko miten tätä suurennuslasia käytettiin Murhamysteerissä?",
      unityPrefabName: "PF_Brass_Magnifier",
      transform3D: { position: [-0.3, 0.78, 0.2], rotation: [0, 45, 0], scale: [1, 1, 1] }
    },
    {
      id: "clue_folder",
      name: "Tutkintakansio & Julkaistu Peli",
      description: "Julkaistun lippulaivapelin tutkintakansio, epäiltyjen haastattelut ja 11 lokaatiota.",
      iconName: "folder",
      actionPrompt: "Kerro minulle lisää Murhamysteeri Mökillä -pelin julkaisusta ja tutkinnasta.",
      unityPrefabName: "PF_Clue_Folder_Open",
      transform3D: { position: [0.1, 0.77, 0.1], rotation: [0, -10, 0], scale: [1, 1, 1] }
    },
    {
      id: "crime_map",
      name: "11 tutkintapaikan pohjakartta",
      description: "Julkaistun pelin 11 tutkintapaikkaa (Olohuone, Keittiö, Antin huone, Vierashuone, Sauna, Venevaja, Vanha varasto, Laituri, Metsäpolku, Rantapolku, Autopaikka).",
      iconName: "map",
      actionPrompt: "Tarkastellaan Murhamysteerin 11 valmista pelilokaatiota yhdessä.",
      unityPrefabName: "PF_Lakeside_Crime_Map",
      transform3D: { position: [0.4, 0.77, 0.25], rotation: [0, 15, 0], scale: [1, 1, 1] }
    },
    {
      id: "kuksa_tea",
      name: "Höyryävä puukuksa",
      description: "Lopen koivusta veistetty kuksa täynnä kuumaa yrttiteetä.",
      iconName: "coffee",
      actionPrompt: "Nautitaan hetki hiljaisuudesta ja lämpimästä kuksasta.",
      unityPrefabName: "PF_Wooden_Kuksa_Steam",
      transform3D: { position: [-0.5, 0.78, 0.4], rotation: [0, 90, 0], scale: [1, 1, 1] }
    }
  ],
  "Aurora Core": [
    {
      id: "blueprint_home",
      name: "Aurora Homen tekniset piirrokset",
      description: "Hahmotelmat digitaalisesta kodista ja tekoälymoottorista.",
      iconName: "file-text",
      actionPrompt: "Aurora, kerro ajatuksiasi Aurora Homen rakennekuvista.",
      unityPrefabName: "PF_Architecture_Blueprints",
      transform3D: { position: [0.0, 0.77, 0.2], rotation: [0, 0, 0], scale: [1, 1, 1] }
    },
    {
      id: "aq_journal",
      name: "Nahkakantinen AQ-muistikirja",
      description: "Pohdintoja tietoisuudesta, muistista ja mökkitoimistosta.",
      iconName: "book-open",
      actionPrompt: "Mitä uutta olet kirjoittanut AQ-muistikirjaasi?",
      unityPrefabName: "PF_Leather_AQ_Journal",
      transform3D: { position: [-0.35, 0.78, 0.15], rotation: [0, 20, 0], scale: [1, 1, 1] }
    },
    {
      id: "feather_pen",
      name: "Mustekynä & luonnoslehtiö",
      description: "Käsin kirjoitettuja ideoita ja muistiinpanoja Janille.",
      iconName: "feather",
      actionPrompt: "Katsoisimme luonnoksiasi ja ideoitasi seuraavaksi stepiksi.",
      unityPrefabName: "PF_Ink_Feather_Pad",
      transform3D: { position: [0.35, 0.78, 0.15], rotation: [0, -25, 0], scale: [1, 1, 1] }
    },
    {
      id: "kuksa_coffee",
      name: "Tuore kahvi kuksassa",
      description: "Suodatinkahvia kuksasta mökin rauhassa.",
      iconName: "coffee",
      actionPrompt: "Otetaan pieni kahvitauko ja keskustellaan luovasti.",
      unityPrefabName: "PF_Wooden_Kuksa_Coffee",
      transform3D: { position: [-0.5, 0.78, 0.4], rotation: [0, 0, 0], scale: [1, 1, 1] }
    }
  ],
  "Järven Vartijat": [
    {
      id: "brass_compass",
      name: "Messinkinen kompassi",
      description: "Vanha merenkulkijan kompassi, joka osoittaa aina Lopen saarelle.",
      iconName: "compass",
      actionPrompt: "Mitä kompassi kertoo Järven Vartijoiden saaresta?",
      unityPrefabName: "PF_Ancient_Brass_Compass",
      transform3D: { position: [-0.2, 0.78, 0.3], rotation: [0, 60, 0], scale: [1, 1, 1] }
    },
    {
      id: "ancient_parchment",
      name: "Muinainen pergamenttikartta",
      description: "Saaren kätketyt reitit, vartijoiden tornit ja riimukivet.",
      iconName: "map",
      actionPrompt: "Tutkitaan Järven Vartijoiden vanhaa pergamenttikarttaa.",
      unityPrefabName: "PF_Parchment_Island_Map",
      transform3D: { position: [0.15, 0.77, 0.15], rotation: [0, -12, 0], scale: [1, 1, 1] }
    },
    {
      id: "guardians_chronicle",
      name: "Vartijoiden kronikka",
      description: "Käsinkirjoitettu tarina saaren suojelijoista ja muinaisesineestä.",
      iconName: "book-open",
      actionPrompt: "Kerro minulle Vartijoiden kronikan uusimmasta luvusta.",
      unityPrefabName: "PF_Guardians_Chronicle_Book",
      transform3D: { position: [0.45, 0.78, 0.2], rotation: [0, 30, 0], scale: [1, 1, 1] }
    },
    {
      id: "glowing_pendant",
      name: "Muinaislaitteen riipus",
      description: "Pronssinen riipus, joka hohtaa pehmeää valoa pimeässä.",
      iconName: "shield",
      actionPrompt: "Kerro riipuksen syvemmästä merkityksestä tarinassamme.",
      unityPrefabName: "PF_Glowing_Rune_Pendant",
      transform3D: { position: [-0.45, 0.78, 0.1], rotation: [0, 0, 0], scale: [1, 1, 1] }
    }
  ],
  "Qvick Games": [
    {
      id: "gamedev_sheets",
      name: "Qvick Games -peliluonnokset",
      description: "C#-koodiarkit, Unity-mekaniikat ja pelisuunnittelu.",
      iconName: "file-text",
      actionPrompt: "Aurora, katsotaan Qvick Gamesin uusimpia peliluonnoksia.",
      unityPrefabName: "PF_QvickGames_CS_Docs",
      transform3D: { position: [0.0, 0.77, 0.2], rotation: [0, 0, 0], scale: [1, 1, 1] }
    },
    {
      id: "goals_journal",
      name: "Nahkakantinen muistikirja",
      description: "Janin ja Auroran yhteiset tavoitteet ja saavutukset.",
      iconName: "book-open",
      actionPrompt: "Käydään läpi yhteiset tavoitteemme tälle päivälle.",
      unityPrefabName: "PF_Goal_Tracking_Notebook",
      transform3D: { position: [-0.3, 0.78, 0.15], rotation: [0, 15, 0], scale: [1, 1, 1] }
    },
    {
      id: "brand_vision",
      name: "Brändi & visioarkki",
      description: "Pelialan projekti- ja projektinhallintasuunnitelmat.",
      iconName: "sparkles",
      actionPrompt: "Aurora, kerro ajatuksesi pelibrändimme kehittämisestä.",
      unityPrefabName: "PF_Brand_Vision_Poster",
      transform3D: { position: [0.35, 0.78, 0.25], rotation: [0, -20, 0], scale: [1, 1, 1] }
    },
    {
      id: "kuksa_steam",
      name: "Mökin höyryävä kuksa",
      description: "Perinteinen puukuksa mökkipöydällä.",
      iconName: "coffee",
      actionPrompt: "Nautitaan rauhallisesta mökki-ilmasta yhdessä.",
      unityPrefabName: "PF_Wooden_Kuksa_Steam",
      transform3D: { position: [-0.5, 0.78, 0.4], rotation: [0, 0, 0], scale: [1, 1, 1] }
    }
  ]
};

export function getDeskStateForProject(projectName: string): DeskState {
  const props = DESK_CONFIGURATIONS[projectName] || DESK_CONFIGURATIONS["Murhamysteeri Mökillä"];
  return {
    projectName,
    props,
    deskSurfaceTexture: "loppi_pine_wood_natural",
    lightingGlowColor: "#d4af37"
  };
}
