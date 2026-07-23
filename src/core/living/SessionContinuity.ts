export interface SessionContinuityState {
  lastVisitTimestamp: string;
  lastProjectName: string;
  lastActivityLabel: string;
  visitCount: number;
  continuityNotes: string[];
}

const STORAGE_KEY = "aurora_session_continuity_v1";

export function loadSessionContinuity(): SessionContinuityState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore error
  }

  // Default initial session continuity
  return {
    lastVisitTimestamp: new Date().toISOString(),
    lastProjectName: "Murhamysteeri Mökillä",
    lastActivityLabel: "Järjestelee työpöytää",
    visitCount: 1,
    continuityNotes: [
      "Muistiinpanot ovat järjestyksessä työpöydällä."
    ]
  };
}

export function saveSessionContinuity(
  projectName: string,
  activityLabel: string
): SessionContinuityState {
  const prev = loadSessionContinuity();
  const updated: SessionContinuityState = {
    lastVisitTimestamp: new Date().toISOString(),
    lastProjectName: projectName,
    lastActivityLabel: activityLabel,
    visitCount: prev.visitCount + 1,
    continuityNotes: [
      `Jätimme ${projectName} -projektin kesken edellisellä kerralla.`,
      `Muistiinpanot ovat edelleen valmiina työpöydällä.`
    ]
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    // Ignore error
  }

  return updated;
}

export function getContinuityMessage(projectName: string): string {
  const session = loadSessionContinuity();
  const timeDiffMinutes = Math.floor(
    (Date.now() - new Date(session.lastVisitTimestamp).getTime()) / 60000
  );

  if (timeDiffMinutes < 15) {
    return `Mukava kun palasit heti takaisin. Työpöytämme ja ${projectName} ovat juuri sellaisina kuin ne jätimme.`;
  } else if (timeDiffMinutes < 240) {
    return `Mukava nähdä taas Jani. Jätimme ${projectName} -suunnittelun kesken tovi sitten. Muistiinpanot ovat valmiina.`;
  } else {
    return `Tervetuloa takaisin mökille Jani. Jätimme ${projectName} -projektin valmiiksi pöydälle odottamaan saapumistasi.`;
  }
}
