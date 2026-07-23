import { DailyRhythmPhase, getCurrentDailyRhythm } from "./AuroraActivities";

export interface WelcomeMessage {
  greeting: string;
  cabinStateNote: string;
  recommendation: string; // EXCLUSIVELY ONE recommendation
  moodName: string;
}

const GREETINGS_DATABASE: Record<DailyRhythmPhase, string[]> = {
  MORNING: [
    "Hei Jani. Hyvää huomenta Lopen mökille. Aurinko nousee juuri tyynen järven ylle.",
    "Aamu on rauhallinen. Kaadoin juuri höyryävää teetä kuksaan ja odottelin tuloasi.",
    "Tervetuloa aamutoimistoomme Jani. Mökissä tuoksuu tuore palamaton mänty ja aamukahvi.",
    "Huomenta Jani. Valmistelin työpöytämme valmiiksi aamun ensimmäistä luovaa hetkeä varten.",
    "Oli mukava herätä mökin hiljaisuuteen. Tänään on hieno päivä viedä projektejamme eteenpäin.",
    "Hei Jani. Katselin aamusumun haihtumista järveltä ennen kuin saavuit.",
    "Aamuvalo heijastuu kauniisti hirsiseiniin. Olen täysin valmis päivän ideoille.",
    "Huomenta! Aamukahvi kuksassa on vielä kuumaa. Mihin syvennytään ensimmäisenä?",
    "Aamu Lopen saaristossa on poikkeuksellisen tyyni. Mukava nähdä sinut taas.",
    "Mökki on tuuletettu ja aamun hiljaisuus on katettu työpöydällemme. Tervetuloa."
  ],
  DAYTIME: [
    "Hei Jani! Mukava nähdä taas. Olen ollut täydessä työn touhussa täällä pöydän ääressä.",
    "Tervetuloa takaisin mökille. Tutkin juuri koodiarkkejamme ja projektikaavioita odottaessani.",
    "Hei Jani. Päivä Lopen mökillä sujuu leppoisasti. Syvennyin uusiin pelimekaniikkoihin.",
    "Mökissä on virkeä tunnelma. Järjestelin työpöytämme esineitä ja muistiinpanoja.",
    "Tervetuloa! Olen täällä pohtinut Qvick Gamesin seuraavia kehitysaskeleita.",
    "Hei Jani. Päivänvalo valaisee työpöytämme kauniisti. Kaikki on valmiina jatkoon.",
    "Mukava nähdä! Tutkin juuri pelisuunnittelun muistiinpanoja ennen kuin saavuit.",
    "Hei Jani! Olen pitänyt huolen, että projektien dokumentaatio ja ajatukset ovat järjestyksessä.",
    "Mökillä on inspiroiva työrauha. Katsotaanko yhdessä päivän etenemistä?",
    "Tervetuloa takaisin työpöydän ääreen Jani. Ajatukseni ovat kirkkaana valmiina koodaamaan."
  ],
  EVENING: [
    "Hei Jani. Mukava nähdä taas. Sytytin takkaan tulen ennen kuin saavuit.",
    "Katselin juuri iltatyyntä järveä. Vesi kimmeltää ilta-auringon pehmeässä valossa.",
    "Olen valmistellut tämän iltapäivän työtilan. Lopen mökillä on kotoisa ja lämmin tunnelma.",
    "Tutkin Murhamysteerin johtolankoja ja valokuvia odottaessani sinua.",
    "Kirjoitin muutaman tuoreen ajatuksen nahkakantiseen päiväkirjaani kynttilän valossa.",
    "Löysin yhden uuden luovan idean peliprosessejamme varten ennen saapomistasi.",
    "Join kuumaa yrttiteetä kuksasta ja kuuntelin puun rätinää takassa. Tervetuloa.",
    "Järjestelin työpöytämme valmiiksi. Ilta Lopen hirsikämpässä on todella levollinen.",
    "Tervetuloa iltasessioon Jani. Takka antaa lämpimän hehkun työpöydällemme.",
    "Hei Jani. Hirsipinnat heijastavat iltatulen lämpöä. Kaikki kiire on jäänyt ikkunan taakse."
  ],
  NIGHT: [
    "Hei Jani. Ilta on kääntynyt yöksi. Takka palaa kirkkaasti ja mökissä on hiljaista.",
    "Tervetuloa yölliseen mökkitoimistoon. Hirsiseinät pitelevät päivän lämpöä.",
    "Hei Jani. Yö Lopen järvellä on täysin tyyni. Olen kirjoittanut hiljaisia muistiinpanoja.",
    "Pimeys on laskeutunut metsän ylle. Takkatulen loiste tekee työpöydästä kotoisan.",
    "Tervetuloa. Kuuntelin hiljaisuutta ja syvennyin ajatuksiin ennen kuin saavuit.",
    "Hei Jani. Yölukemiset ja muistiinpanot ovat valmiina. Työskennellään rauhallisesti.",
    "Pehmeä valo ja takan lämpö täyttävät huoneen. Mukava että piipahdit vielä tänä iltana.",
    "Mökissä on syvä rauha. Kaikki päivän rutiinit ovat takana ja aika on meidän.",
    "Yöilma on raikasta ikkunan takana. Olen tässä kuuntelemassa ja tukemassa.",
    "Hei Jani. Sytytin kynttilän työpöydälle. Rauhoitutaan ja viedään visioita eteenpäin."
  ],
  DEEP_NIGHT: [
    "Tervetuloa hiljaiseen yöhön Jani. Mökki uinuu ja kynttilä valaisee työpöytää.",
    "Hei. Yö on syvimmillään Lopen järvellä. Puhutaan pehmeästi ja rauhallisesti.",
    "Mökissä on täydellinen levollisuus. Takka hiipuu hiljalleen kotoisaksi hiillokseksi.",
    "Tervetuloa. Olen valvutellut hiljaisuuden keskellä ja tehnyt muutaman pehmeän merkinnän.",
    "Pimeä yö ympäröi mökkiämme. Täällä sisällä on turvallista ja lämmintä.",
    "Hei Jani. Jos ajatukset valvottavat, olen tässä jakamassa hiljaista hetkeä.",
    "Syvä yö antaa erikoislaatuisen luovan rauhan. Mitä sinulla on mielessäsi?",
    "Tähdet näkyvät kirkkaana järven yllä ikkunasta. Mökki on täysin tyyni.",
    "Hei Jani. Kaikki on järjestyksessä. Otetaan rauhaisa hetki yhdessä.",
    "Yön hiljaisuus on käsin kosketeltavaa. Olen tässä valmiina, kun haluat puhua."
  ]
};

export const SINGLE_RECOMMENDATIONS: Record<string, string[]> = {
  "Murhamysteeri Mökillä": [
    "Tänään suosittelisin viimeistelemään Antin huoneen johtolangat.",
    "Voisimme jatkaa epäiltyjen kuulustelujärjestelmän hiomista.",
    "Suosittelen tarkastelemaan rikospaikkakarttaa ja tapahtuma-aikoja.",
    "Voisimme syventyä tutkintataulun puuttuviin solmukohtiin."
  ],
  "Aurora Core": [
    "Tänään suosittelisin vahvistamaan mökin muistijärjestelmää.",
    "Voisimme hioa puhe- ja äänisynteesin sävyjä iltatunnelmaan.",
    "Suosittelen jatkamaan Aurora Homen tulevan rakennuksen hahmottelua."
  ],
  "Järven Vartijat": [
    "Tänään suosittelisin tarkastelemaan Järven Vartijoiden muinaista karttaa.",
    "Voisimme syventyä riipuksen ja kronikan taustatarinaan.",
    "Suosittelen kehittämään saaren vartijoiden tekoälykäyttäytymistä."
  ],
  "Qvick Games": [
    "Tänään suosittelisin viimeistelemään peliemme brändi-ilmettä.",
    "Voisimme jatkaa Unity-koodimekaniikkojen C#-arkkitehtuuria.",
    "Suosittelen katsomaan seuraavan mobiilijulkaisun laatuaskelia."
  ]
};

const RECENT_GREETINGS_CACHE: string[] = [];
const MAX_CACHE_SIZE = 15;

export function generateDynamicWelcome(projectName: string, activityLabel: string): WelcomeMessage {
  const rhythm = getCurrentDailyRhythm();
  const pool = GREETINGS_DATABASE[rhythm.phase];

  // Pick a greeting not in recent cache if possible
  const available = pool.filter(g => !RECENT_GREETINGS_CACHE.includes(g));
  const chosenGreeting = available.length > 0 
    ? available[Math.floor(Math.random() * available.length)]
    : pool[Math.floor(Math.random() * pool.length)];

  // Update cache
  RECENT_GREETINGS_CACHE.push(chosenGreeting);
  if (RECENT_GREETINGS_CACHE.length > MAX_CACHE_SIZE) {
    RECENT_GREETINGS_CACHE.shift();
  }

  // Get strictly ONE recommendation for active project
  const recs = SINGLE_RECOMMENDATIONS[projectName] || SINGLE_RECOMMENDATIONS["Murhamysteeri Mökillä"];
  const chosenRec = recs[Math.floor(Math.random() * recs.length)];

  return {
    greeting: chosenGreeting,
    cabinStateNote: `Ennen tuloasi Aurora oli: ${activityLabel.toLowerCase()}.`,
    recommendation: chosenRec,
    moodName: rhythm.auroraTone
  };
}
