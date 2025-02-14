import express from "express";
import cors from "cors";
import { wrestlers } from "./wrestlers"; // ✅ Correct path if `wrestlers.ts` is inside backend/


const raffleResults: { [leagueId: string]: Entrant[] } = {}; // 🔥 Temporary in-memory storage

const app = express();
app.use(cors());
app.use(express.json());

// Define Types
interface Participant {
  name: string;
  entrants: number;
}

interface Entrant {
  number: number;
  participant: string;
  name: string; // Wrestler name (default "TBD" until assigned)
  status: "Active" | "Eliminated";
}

interface League {
  leagueId: string;
  leagueName: string;
  participants: Participant[];
  entrants: Entrant[];
}

// Temporary in-memory storage for leagues
const leagues: { [key: string]: League } = {};

// ✅ Health check endpoint
app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("RumbleRaffle Backend is Running! 🎉");
});

// ✅ Create League Route (NO "/api/")
app.post("/create-league", (req, res) => {
  const { leagueName, participants } = req.body;

  if (!leagueName || !participants || participants.length < 2) {
    return res.status(400).json({ error: "Invalid league data" });
  }

  const totalEntrants = participants.reduce((sum: number, p: Participant) => sum + p.entrants, 0);
  if (totalEntrants !== 30) {
    return res.status(400).json({ error: "Total entrants must be exactly 30" });
  }

  const leagueId = Math.random().toString(36).substr(2, 9);

  // Generate entrants list
  let entrantNumber = 1;
  const entrants: Entrant[] = participants.flatMap((participant: Participant) =>
    Array.from({ length: participant.entrants }, () => ({
      number: entrantNumber++,
      participant: participant.name,
      name: "TBD", // Wrestler name defaults to TBD
      status: "Active",
    }))
  );

  // Store league in memory
  leagues[leagueId] = { leagueId, leagueName, participants, entrants };

  console.log("New League Created:", leagues[leagueId]);

  res.json({ message: "League Created!", leagueId });
});

// ✅ Get All Leagues
app.get("/leagues", (req, res) => {
  res.json(Object.values(leagues));
});

// ✅ Get a Specific League
app.get("/league/:id", (req, res) => {
  const league = leagues[req.params.id];
  if (!league) {
    return res.status(404).json({ error: "League not found" });
  }
  res.json(league);
});

// ✅ Store Raffle Results Correctly (NO "/api/")
app.post("/assign-raffle-results", (req, res) => {
  const { leagueId, entrants } = req.body as { leagueId: string; entrants: { participant: string }[] };

  if (!leagueId || !entrants || entrants.length !== 30) {
    return res.status(400).json({ error: "Invalid raffle results" });
  }

  if (!leagues[leagueId]) {
    return res.status(404).json({ error: "League not found" });
  }

  // ✅ Store entrants in both `leagues` and `raffleResults`
  const formattedEntrants: Entrant[] = entrants.map((entrant, index) => ({
    number: index + 1,
    participant: entrant.participant,
    name: "TBD", // Placeholder until a wrestler is assigned
    status: "Active",
  }));

  leagues[leagueId].entrants = formattedEntrants; // ✅ Store in league object
  raffleResults[leagueId] = formattedEntrants; // ✅ Store in raffle results

  console.log("✅ Raffle results stored:", JSON.stringify(raffleResults[leagueId], null, 2));

  res.json({ message: "Raffle results saved!" });
});

// ✅ Fetch Entrants for a Specific League (Live Tracker)
app.get("/live-tracker", (req, res) => {
  const { leagueId } = req.query;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Missing or invalid leagueId" });
  }

  // ✅ Fetch entrants from `raffleResults`
  const entrants = raffleResults[leagueId];

  if (!entrants || entrants.length === 0) {
    return res.status(404).json({ error: "No entrants found for this league" });
  }

  console.log("📌 Live Tracker Data:", JSON.stringify(entrants, null, 2));
  res.json(entrants);
});

// ✅ API Route to Get All Wrestlers
app.get("/wrestlers", (req, res) => {
  res.json(wrestlers);
});

// ✅ Toggle Entrant Status (Active/Eliminated)
app.patch("/live-tracker/toggle-status", (req, res) => {
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

  // Toggle status
  entrant.status = entrant.status === "Active" ? "Eliminated" : "Active";

  res.json({ message: "Entrant status updated", entrant });
});

// ✅ Serve Wrestler List (for Search)
app.get("/wrestlers", (req, res) => {
  const search = req.query.search as string;

  if (!search || search.length < 3) {
    return res.json([]); // Require at least 3 letters to search
  }

  const filtered = wrestlers.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  res.json(filtered.slice(0, 10)); // ✅ Limit results to 10
});

// ✅ Update Wrestler Name for an Entrant
app.patch("/live-tracker/update-wrestler", (req, res) => {
  const { leagueId, entrantNumber, newName } = req.body;

  if (!leagueId || !entrantNumber || !newName) {
    return res.status(400).json({ error: "League ID, Entrant Number, and new name are required" });
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

// ✅ Start Express Server (Locally)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// ✅ Export app for Vercel
export default app;
