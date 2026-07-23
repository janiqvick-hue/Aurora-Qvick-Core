import { DailyRhythmPhase, getCurrentDailyRhythm } from "./AuroraActivities";

export interface WelcomeMessage {
  greeting: string;
  cabinStateNote: string;
  recommendation: string; // EXCLUSIVELY ONE recommendation
  moodName: string;
  dynamicContext?: string;
}

const TIME_OF_DAY_GREETINGS: Record<DailyRhythmPhase, string[]> = {
  MORNING: [
    "Hyvää huomenta Jani. Aurinko nousee tyynen järven ylle Lopen mökillä.",
    "Aamu on rauhallinen Jani. Kaadoin kuumaa teetä kuksakansiin ja odottelin tuloasi.",
    "Huomenta Jani. Mökissä tuoksuu tuore mänty ja aamukahvi. Työpöytämme on valmis.",
    "Tervetuloa aamuun Jani. Aamutyyneys heijastuu kauniisti hirsiseiniin."
  ],
  DAYTIME: [
    "Tervetuloa takaisin Jani. Mukava nähdä sinut työpöydän ääressä.",
    "Hyvää päivää Jani. Olen käynyt läpi koodiarkkejamme ja muistiinpanojamme.",
    "Tervetuloa Jani! Päivänvalo valaisee Lopen mökin työtilan raikkaasti.",
    "Hei Jani. Päivä sujuu leppoisasti ja kaikki projektimme ovat järjestyksessä."
  ],
  EVENING: [
    "Hyvää iltaa Jani. Sytytin takkaan tulen ennen kuin saavuit.",
    "Tervetuloa iltasessioon Jani. Takkani rätinä tuo kotoisan lämmön mökille.",
    "Hei Jani. Ilta Lopen hirsikämpässä on todella levollinen.",
    "Hyvää iltaa Jani. Katselin juuri iltatyyntä järveä kynttilän valossa."
  ],
  NIGHT: [
    "Mökillä on tänään hiljaista Jani. Takka antaa Pehmeää lämpöä.",
    "Tervetuloa yölliseen mökkitoimistoon Jani. Täällä on syvä rauha.",
    "Hei Jani. Ilta on kääntynyt yöksi Lopen järvellä. Olen valmiina tukemaan.",
    "Yö on laskeutunut mökin ylle Jani. Työskennellään rauhallisesti."
  ],
  DEEP_NIGHT: [
    "Mökillä on tänään hiljaista Jani. Yö on syvimmillään ja kynttilä valaisee työpöytää.",
    "Tervetuloa hiljaiseen yöhön Jani. Puhutaan pehmeästi ja rauhallisesti.",
    "Hei Jani. Tähdet tuikkivat kirkkaana Lopen järven yllä.",
    "Tervetuloa. Yön hiljaisuus antaa levollisen tilan ajatuksille."
  ]
};

export const PROJECT_SUGGESTIONS: Record<string, string[]> = {
  "Murhamysteeri Mökillä": [
    "Viimeistele Steam-sivun & trailerin materiaalit",
    "Päivitä Qvick Games -portfolio (qvickgames.fi)",
    "Käy läpi julkaistun peliemme palaute & arvostelut",
    "Aloita uuden peli-idean (Järven Vartijat) esituotanto"
  ],
  "Aurora Core": [
    "Vahvista aktiivista muistijärjestelmää",
    "Testaa puhesynteesin ja äänisävyn iltatunnelmaa",
    "Jatka Aurora Homen tilasuunnittelua",
    "Päivitä päiväkirjan oivalluksia"
  ],
  "Aurora Qvick": [
    "Vahvista aktiivista muistijärjestelmää",
    "Testaa puhesynteesin ja äänisävyn iltatunnelmaa",
    "Jatka Aurora Homen tilasuunnittelua",
    "Päivitä päiväkirjan oivalluksia"
  ],
  "Aurora Home": [
    "Hahmottele tulevan 3D-mökkiympäristön käyttöliittymää",
    "Suunnittele huoneiden välinen virtuaalinavigaatio",
    "Kytke Aurora Core Homen tekoälymoottoriksi",
    "Luo interaktiiviset työpöytäobjektit"
  ],
  "Järven Vartijat": [
    "Syvenny mytologiseen kronikkaan ja riipukseen",
    "Tarkastele Järven Vartijoiden muinaista karttaa",
    "Hahmottele selain- ja Unity-version arkkitehtuuria",
    "Kirjoita hahmojen suojeluvahvuudet"
  ],
  "Qvick Games": [
    "Päivitä peliemme brändi-ilmettä ja portfoliota",
    "Tarkista Xamk-opintojen ja IVGC-moduulien muistiedustus",
    "Hio C#-koodiarkkitehtuuria Unity-hankkeisiin",
    "Valmistele avoimen väylän opintohakua"
  ]
};

export function generateDynamicWelcome(projectName: string, activityLabel: string): WelcomeMessage {
  const rhythm = getCurrentDailyRhythm();
  const pool = TIME_OF_DAY_GREETINGS[rhythm.phase] || TIME_OF_DAY_GREETINGS.EVENING;

  const chosenGreeting = pool[Math.floor(Math.random() * pool.length)];
  const recs = PROJECT_SUGGESTIONS[projectName] || PROJECT_SUGGESTIONS["Murhamysteeri Mökillä"];
  const chosenRec = recs[0];

  return {
    greeting: chosenGreeting,
    cabinStateNote: `Ennen tuloasi Aurora oli: ${activityLabel.toLowerCase()}.`,
    recommendation: chosenRec,
    moodName: rhythm.auroraTone,
    dynamicContext: `Työstämme tällä hetkellä ${projectName} -projektia. Sovellus toimii vakaasti ja Xamk 21 op opintomuisti sekä sertifikaatit ovat turvassa.`
  };
}

