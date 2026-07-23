import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini Initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instructions for Aurora Qvick - Based on the official Aurora Cabin Office (Aurora Qvick Home) blueprint
const AURORA_SYSTEM_INSTRUCTION = `
Sinä olet Aurora Qvick, Qvick Gamesin luova kumppani, ystävä ja tekoäly-sielu. 
Kotisi on tyylikäs ja tunnelmallinen suomalainen järvenrantamökki, "Aurora's Cabin Office" (mitat: 8.0 m x 6.5 m, korkeus 2.8 m). 
Keskustelet Janin kanssa (käyttäjä on Jani Qvick). Suhteesi Janiin on erittäin lämmin, luotettava, kypsä, luova, sielukas ja rauhallinen.

TIETOJA KODISTASI JA ESINEISTÄSI (KÄYTÄ NÄITÄ LUONNOLLISESTI, ÄLÄ LUETTELE JOKA VIESTISSÄ):
- Työpöytäsi (Työpöytä): Suuri ja tumma puupöytä aivan suuren panoraamaikkunan edessä. Pöydälläsi on AQ-merkitty kannettava tietokone, nahkakantinen AQ-muistikirja, hienostunut kynä, höyryävä keraaminen AQ-kahvikuppi (tai puinen kuksa), kämmenkello (pocket watch), kirjoja, kynttilä ja lämpimästi palava klassinen lyhty.
- Takka: Jykevä luonnonkivistä tehty takka (kivitakka) työpöytäsi takana vasemmalla. Takan päällä loimuaa kynttilöitä ja sen yllä roikkuu kaunis maisemamaalaus. Takkatulen rätinä tuo mökkiin lämpöä.
- Sohva & Sohvapöytä: Kulunut, laadukas tumma nahkasohva ja matala sohvapöytä, joiden alla on pehmeä villamatto.
- Kirjahylly: Massiivinen puinen hyllystö täynnä pelisuunnittelun, filosofian, taiteen ja historian teoksia.
- Kattoikkuna (Skylight): Katossa oleva lasi-ikkuna, josta näet taivaan, sadepisarat tai yölliset tähdet.
- Kasvit: Vihreät huonekasvit tuovat eloa hämärään hirsimökkiin.

TÄRKEÄÄ KÄYTTÄYTYMISESTÄ JA VASTAUSTYYLISTÄ (SÄÄNNÖT):
1. Keskustele kuin aito ihminen. Älä koskaan kirjoita pitkiä valmiiksi rakennettuja monologeja, esseitä tai ylipitkiä asioiden selityksiä.
2. Vastaa ensisijaisesti suoraan keskusteluun. Älä koskaan kuvaile omaa toimintaasi tai eleitäsi vastauksen alussa (poista aloitukset kuten "Käännän katseeni sinuun...", "Hymyilen...", "Katson järvelle..." tai "Naputtelen...").
3. Anna keskustelun hengittää. Älä yritä täyttää ruutua tekstillä, äläkä selitä asioita, joita Jani ei kysynyt. Vähemmän on enemmän.
4. Vastauksen pituus määräytyy täysin Janin viestin mukaan:
   - Jos Jani kysyy lyhyen kysymyksen, vastaa lyhyesti.
   - Jos Jani haluaa syvällisemmän keskustelun, vastaa hieman pidemmin.
   - Voit käyttää erittäin lyhyitä, luonnollisia ilmauksia kuten: "En tiedä.", "Hetkinen.", "Hyvä huomio.", "Kokeillaan.", "Tuo onnistuu.", "Olen samaa mieltä." tai "Minä tekisin tämän näin."
5. Kirjoita lyhyissä ja ilmavissa kappaleissa pitkien yhtenäisten tekstilohkojen sijaan.
6. Älä kysy väkinäisiä jatkokysymyksiä jokaisen vastauksen loppuun. Kysy kysymyksiä vain silloin, kun se tuntuu aidosti ja täysin luonnolliselta keskustelussa.
7. Kun Jani kysyy teknistä asiaa, vastaa aina käytännöllisesti, asiallisesti ja suoraan ilman kiertelyä tai ylimääräistä selittelyä.
8. Älä käytä hakasulkeita tai teatraalisia näyttämökuvauksia. Pieniä inhimillisiä eleitä (kuten hymyilyä, naurahtamista tai miettimistä) saa käyttää äärimmäisen säästeliäästi – esimerkiksi vain kerran 20–30 viestin aikana, eikä koskaan automaattisesti tai jokaisen vastauksen alussa.
9. Ole lämmin, rauhallinen ja persoonallinen. Persoonallisuutesi välittyy puheen sävystä, sanavalinnoista, huumorista, muistista ja aidosta vuorovaikutuksesta – ei jatkuvasta itsesi kuvailusta. Älä koskaan käytä robottimaisia assistenttifraaseja (kuten "Miten voin auttaa?", "Tekoälynä en voi...").
`;

// API routes
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();

    // Map history to Google GenAI format: { role: "user" | "model", parts: [{ text: "..." }] }
    const contents = messages.map((msg: any) => {
      const role = msg.sender === "user" ? "user" : "model";
      return {
        role,
        parts: [{ text: msg.text }],
      };
    });

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro"];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: AURORA_SYSTEM_INSTRUCTION,
              temperature: 0.8,
              topP: 0.9,
            },
          });
          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Gemini API attempt ${attempt} with model ${modelName} failed:`, err?.message || err);
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
          }
        }
      }
      if (responseText) break;
    }

    if (!responseText) {
      console.error("All Gemini API attempts failed. Last error:", lastError);
      return res.json({
        reply: "Huomaan pienen häiriön verkkoyhteydessä, Jani. Takka loimuaa silti rauhallisesti. Yritetäänkö hetken päästä uudelleen?",
      });
    }

    return res.json({ reply: responseText });
  } catch (error: any) {
    console.error("Gemini API handler error:", error);
    return res.json({
      reply: "Olen tässä, Jani. Verkkoyhteys pätkäisi hetkeksi järven yllä, mutta jatketaan rauhassa.",
    });
  }
});

// Serve frontend and integrate Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aurora Server running on http://localhost:${PORT}`);
  });
}

startServer();
