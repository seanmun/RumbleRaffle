"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 5050;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Temporary in-memory storage for leagues
const leagues = {};
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
    const totalEntrants = participants.reduce((sum, p) => sum + p.entrants, 0);
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
// Start Server
app.listen(PORT, () => {
    console.log(`RumbleRaffle Backend is Running on port ${PORT}! 🎉`);
});
