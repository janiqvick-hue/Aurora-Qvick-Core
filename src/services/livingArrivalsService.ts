export interface ArrivalGreeting {
  greeting: string;
  activityDescription: string;
  recommendation: string; // EXCLUSIVELY ONE recommendation
  deskNote: string;
}

export const GREETINGS_LIST = [
  "Hei Jani. Mukava nähdä taas. Sytytin takkaan tulen ennen kuin saavuit.",
  "Katselin juuri järvelle. Tänään siellä on poikkeuksellisen tyyntä.",
  "Olen valmistellut tämän päivän työtilan. Lopella on leppoisa tunnelma.",
  "Ihailin juuri Murhamysteeri Mökillä -pelin julkaisun saavutusta.",
  "Kirjoitin muutaman tuoreen ajatuksen nahkakantiseen päiväkirjaani.",
  "Löysin yhden uuden luovan idean Qvick Gamesia varten.",
  "Join kuumaa teetä kuksasta ja pohdiskelin pelimekaniikoitamme.",
  "Järjestelin työpöytäämme valmiiksi. Mökillä on rauhaisaa."
];

export const PROJECT_RECOMMENDATIONS: Record<string, string[]> = {
  "Murhamysteeri Mökillä": [
    "Tänään suosittelisin hiomaan Murhamysteeri Mökillä -pelin Steam-kauppasivua ja traileria.",
    "Voisimme katsastaa julkaistun peliemme pelaajapalautetta ja markkinointisuunnitelmaa.",
    "Suosittelen päivittämään Qvick Games -portfolion (qvickgames.fi) julkaisutiedoilla.",
    "Voisimme ideoida seuraavaa Qvick Games -peliä, kuten Järven Vartijoita."
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
    "Tänään suosittelisin viimistelemään peliemme brändi-ilmettä.",
    "Voisimme jatkaa Unity-koodimekaniikkojen C#-arkkitehtuuria.",
    "Suosittelen katsomaan seuraavan mobiilijulkaisun laatuaskelia."
  ]
};

export const RANDOM_AMBIENT_EVENTS = [
  { type: 'fireplace', label: 'Takasta kuuluu pieni kotoisa rätinä', icon: '🔥' },
  { type: 'candle', label: 'Kynttilän liekki lepattaa vienossa ilmavirtauksessa', icon: '🕯️' },
  { type: 'page', label: 'Aurora kääntää muistikirjansa sivua', icon: '📖' },
  { type: 'bird', label: 'Lintu lentää ohi järven yllä ikkunan takana', icon: '🕊️' },
  { type: 'boat', label: 'Kaukana tyynellä järvellä häämöttää pieni vene', icon: '⛵' },
  { type: 'rain', label: 'Sateen pehmeä ropina ikkunaan voimistuu hetkeksi', icon: '🌧️' },
  { type: 'wind', label: 'Tuuli liikuttaa hiljaa rannan mäntyjä', icon: '🌲' }
];

export function getArrivalGreeting(projectName: string = "Murhamysteeri Mökillä"): ArrivalGreeting {
  const randomGreeting = GREETINGS_LIST[Math.floor(Math.random() * GREETINGS_LIST.length)];
  const recs = PROJECT_RECOMMENDATIONS[projectName] || PROJECT_RECOMMENDATIONS["Murhamysteeri Mökillä"];
  const singleRec = recs[Math.floor(Math.random() * recs.length)];

  return {
    greeting: randomGreeting,
    activityDescription: "Aurora viettää omaa rauhallista arkeaan mökissä.",
    recommendation: singleRec,
    deskNote: "Pöydällä on tuoreita muistiinpanoja ja projektiin liittyviä esineitä."
  };
}
