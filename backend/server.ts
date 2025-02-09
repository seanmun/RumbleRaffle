import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// ✅ Fix: Add Type Definitions for `req` and `res`
app.get("/", (req: Request, res: Response) => {
  res.send("RumbleRaffle Backend is Running! 🎉");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
