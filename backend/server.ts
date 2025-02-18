import express from "express";
import { wrestlers } from "../src/app/api/wrestlers";

const app = express();

// If you only serve from the 'www' domain + localhost:3000, keep those.
// If you need the apex domain (e.g., rumbleraffle.com without the 'www') or
// the Vercel subdomain (rumble-raffle.vercel.app) for testing, uncomment/add them.
const allowedOrigins = [
  "https://www.rumbleRaffle.com", // Production (primary domain)
  "http://localhost:3000",        // Local development
  // "https://rumbleraffle.com",    // Uncomment if you serve directly from apex domain
  // "https://rumble-raffle.vercel.app", // Uncomment if you test from Vercel subdomain
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle Preflight Requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// -------------------
// Type Definitions
// -------------------
interface Participant {
  name: string;
  entrants: number;
}

interface Entrant {
  number: number;
  participant: string;
  name: string; // Wrestler name (default "TBD")
  status: "Active" | "Eliminated";
}

interface League {
  leagueId: string;
  leagueName: string;
  participants: Participant[];
  entrants: Entrant[];
}

// -------------------
// In-Memory Storage
// -------------------
const leagues: { [key: string]: League } = {};
const raffleResults: { [leagueId: string]: Entrant[] } = {};

// -------------------
// Health Check Route
// -------------------
app.get(["/api/test", "/api/test/"], (req, res) => {
  res.json({ message: "API is working on Vercel!" });
});

// -------------------
// GET All Wrestlers
// -------------------
app.get(["/api/wrestlers", "/api/wrestlers/"], (req, res) => {
  res.json(wrestlers);
});

// -------------------
// CREATE League
// -------------------
app.post(["/api/create-league", "/api/create-league/"], (req, res) => {
  const { leagueName, participants } = req.body;

  if (!leagueName || !participants || participants.length < 2) {
    return res.status(400).json({ error: "Invalid league data" });
  }

  const totalEntrants = participants.reduce(
    (sum: number, p: Participant) => sum + p.entrants,
    0
  );
  if (totalEntrants !== 30) {
    return res.status(400).json({ error: "Total entrants must be exactly 30" });
  }

  const leagueId = Math.random().toString(36).substr(2, 9);

  let entrantNumber = 1;
  const entrants: Entrant[] = participants.flatMap((participant: Participant) =>
    Array.from({ length: participant.entrants }, () => ({
      number: entrantNumber++,
      participant: participant.name,
      name: "TBD",
      status: "Active",
    }))
  );

  leagues[leagueId] = { leagueId, leagueName, participants, entrants };

  res.json({ message: "League Created!", leagueId });
});

// -------------------
// GET All Leagues
// -------------------
app.get(["/api/leagues", "/api/leagues/"], (req, res) => {
  res.json(Object.values(leagues));
});

// -------------------
// GET Specific League
// -------------------
app.get(["/api/league/:id", "/api/league/:id/"], (req, res) => {
  const league = leagues[req.params.id];
  if (!league) {
    return res.status(404).json({ error: "League not found" });
  }
  res.json(league);
});

// --------------------------
// STORE Raffle Results
// --------------------------
app.post(["/api/assign-raffle-results", "/api/assign-raffle-results/"], (req, res) => {
  const { leagueId, entrants } = req.body as {
    leagueId: string;
    entrants: { participant: string }[];
  };

  if (!leagueId || !entrants || entrants.length !== 30) {
    return res.status(400).json({ error: "Invalid raffle results" });
  }

  if (!leagues[leagueId]) {
    return res.status(404).json({ error: "League not found" });
  }

  const formattedEntrants: Entrant[] = entrants.map((entrant, index) => ({
    number: index + 1,
    participant: entrant.participant,
    name: "TBD",
    status: "Active",
  }));

  leagues[leagueId].entrants = formattedEntrants;
  raffleResults[leagueId] = formattedEntrants;

  res.json({ message: "Raffle results saved!" });
});

// ---------------------------
// GET Entrants (Live Tracker)
// ---------------------------
app.get(["/api/live-tracker", "/api/live-tracker/"], (req, res) => {
  const { leagueId } = req.query;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Missing or invalid leagueId" });
  }

  const entrants = raffleResults[leagueId];

  if (!entrants || entrants.length === 0) {
    return res.status(404).json({ error: "No entrants found for this league" });
  }

  res.json(entrants);
});

// ---------------------------
// TOGGLE Entrant Status
// ---------------------------
app.patch(["/api/live-tracker/toggle-status", "/api/live-tracker/toggle-status/"], (req, res) => {
  const { leagueId, entrantNumber } = req.body;

  if (!leagueId || !entrantNumber) {
    return res.status(400).json({ error: "League ID and Entrant Number are required" });
  }

  const entrants = raffleResults[leagueId];
  if (!entrants) {
    return res.status(404).json({ error: "League not found" });
  }

  const entrant = entrants.find((e) => e.number === entrantNumber);
  if (!entrant) {
    return res.status(404).json({ error: "Entrant not found" });
  }

  entrant.status = entrant.status === "Active" ? "Eliminated" : "Active";

  res.json({ message: "Entrant status updated", entrant });
});

// ---------------------------
// UPDATE Wrestler Name
// ---------------------------
app.patch(["/api/live-tracker/update-wrestler", "/api/live-tracker/update-wrestler/"], (req, res) => {
  const { leagueId, entrantNumber, newName } = req.body;

  if (!leagueId || !entrantNumber || !newName) {
    return res
      .status(400)
      .json({ error: "League ID, Entrant Number, and new name are required" });
  }

  const entrants = raffleResults[leagueId];
  if (!entrants) {
    return res.status(404).json({ error: "League not found" });
  }

  const entrant = entrants.find((e) => e.number === entrantNumber);
  if (!entrant) {
    return res.status(404).json({ error: "Entrant not found" });
  }

  entrant.name = newName;

  res.json({ message: "Wrestler name updated", entrant });
});

// ---------------------------------
// Start Express Server (Local Only)
// ---------------------------------
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// ------------------------------
// Export app for Vercel
// ------------------------------
export default app;
