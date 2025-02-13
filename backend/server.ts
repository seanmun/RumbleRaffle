import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Define Types
interface Participant {
  name: string;
  entrants: number;
}

interface League {
  leagueId: string;
  leagueName: string;
  participants: Participant[];
}

// Temporary in-memory storage for leagues
const leagues: { [key: string]: League } = {};

// Root Route
app.get("/", (req, res) => {
  res.send("RumbleRaffle Backend is Running! 🎉");
});

// Create League Route
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

  // Store league in memory
  leagues[leagueId] = { leagueId, leagueName, participants };

  console.log("New League Created:", leagues[leagueId]);

  res.json({ message: "League Created!", leagueId });
});

// Get All Leagues
app.get("/leagues", (req, res) => {
  res.json(Object.values(leagues));
});

// Get a Specific League
app.get("/league/:id", (req, res) => {
  const league = leagues[req.params.id];
  if (!league) {
    return res.status(404).json({ error: "League not found" });
  }
  res.json(league);
});

// Export Express app (Required for Vercel)
export default app;
