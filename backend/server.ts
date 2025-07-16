import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Types
interface ParticipantData {
  name: string;
  entrants: number;
}

interface CreateLeagueRequest {
  leagueName: string;
  participants: ParticipantData[];
}

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://www.rumbleraffle.com",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ].filter(Boolean)
}));

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Rumble Raffle API is running!" });
});

// Create League
app.post("/api/create-league", async (req, res) => {
  try {
    const { leagueName, participants }: CreateLeagueRequest = req.body;

    if (!leagueName || !participants || participants.length < 2) {
      return res.status(400).json({ error: "Invalid league data" });
    }

    const totalEntrants = participants.reduce((sum: number, p: ParticipantData) => sum + p.entrants, 0);
    if (totalEntrants !== 30) {
      return res.status(400).json({ error: "Total entrants must be exactly 30" });
    }

    // Create league
    const league = await prisma.league.create({
      data: {
        name: leagueName,
        creatorName: "Anonymous", // We'll make this dynamic later
        status: 'setup'
      }
    });

    // Create participants and entrants
    let entrantNumber = 1;
    
    for (const participantData of participants) {
      const participant = await prisma.participant.create({
        data: {
          name: participantData.name,
          entryCount: participantData.entrants,
          leagueId: league.id
        }
      });

      // Create entrants for this participant
      for (let i = 0; i < participantData.entrants; i++) {
        await prisma.entrant.create({
          data: {
            number: entrantNumber++,
            wrestlerName: 'TBD',
            status: 'Active',
            leagueId: league.id,
            participantId: participant.id
          }
        });
      }
    }

    res.json({ 
      message: "League Created!", 
      leagueId: league.id 
    });

  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({ error: "Failed to create league" });
  }
});

// Get League by ID
app.get("/api/leagues/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const league = await prisma.league.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            entrants: {
              orderBy: { number: 'asc' }
            }
          }
        },
        events: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }

    res.json(league);

  } catch (error) {
    console.error('Error fetching league:', error);
    res.status(500).json({ error: "Failed to fetch league" });
  }
});

// Randomize League Entrants
app.post("/api/leagues/:id/randomize", async (req, res) => {
  try {
    const { id } = req.params;

    // Get all participants for this league
    const participants = await prisma.participant.findMany({
      where: { leagueId: id },
      include: { entrants: true }
    });

    if (participants.length === 0) {
      return res.status(404).json({ error: 'League not found' });
    }

    // Create array of participant IDs based on their entry count
    const participantPool: string[] = [];
    participants.forEach(participant => {
      for (let i = 0; i < participant.entryCount; i++) {
        participantPool.push(participant.id);
      }
    });

    // Shuffle the participant pool
    for (let i = participantPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantPool[i], participantPool[j]] = [participantPool[j], participantPool[i]];
    }

    // Update entrants with randomized assignments
    for (let entrantNumber = 1; entrantNumber <= 30; entrantNumber++) {
      const randomParticipantId = participantPool[entrantNumber - 1];
      
      await prisma.entrant.updateMany({
        where: {
          leagueId: id,
          number: entrantNumber
        },
        data: {
          participantId: randomParticipantId
        }
      });
    }

    // Create event log
    await prisma.event.create({
      data: {
        type: 'entrants_randomized',
        title: 'Entrants randomized',
        description: 'League entrants have been randomly assigned',
        leagueId: id
      }
    });

    res.json({ message: 'Entrants randomized successfully!' });

  } catch (error) {
    console.error('Error randomizing entrants:', error);
    res.status(500).json({ error: "Failed to randomize entrants" });
  }
});

// Update Entrant (Wrestler assignment and elimination)
app.patch("/api/leagues/:leagueId/entrants/:number", async (req, res) => {
  try {
    const { leagueId, number } = req.params;
    const { wrestlerName, status, eliminatedBy } = req.body;

    const entrant = await prisma.entrant.findUnique({
      where: { 
        leagueId_number: { 
          leagueId, 
          number: parseInt(number) 
        } 
      },
      include: { participant: true }
    });

    if (!entrant) {
      return res.status(404).json({ error: 'Entrant not found' });
    }

    // Prepare update data
    const updateData: {
      wrestlerName?: string;
      status?: string;
      eliminatedAt?: Date;
      eliminatedBy?: string;
    } = {};

    if (wrestlerName) updateData.wrestlerName = wrestlerName;
    if (status) {
      updateData.status = status;
      if (status === 'Eliminated') {
        updateData.eliminatedAt = new Date();
        if (eliminatedBy) updateData.eliminatedBy = eliminatedBy;
      }
    }

    // Update entrant
    const updatedEntrant = await prisma.entrant.update({
      where: { id: entrant.id },
      data: updateData
    });

    // Log the appropriate event
    if (wrestlerName && wrestlerName !== entrant.wrestlerName) {
      await prisma.event.create({
        data: {
          type: 'wrestler_assigned',
          title: `${wrestlerName} assigned to #${number}`,
          description: `${entrant.participant.name}'s entry #${number}`,
          leagueId,
          data: { entrantId: entrant.id, wrestlerName }
        }
      });
    }

    if (status === 'Eliminated' && entrant.status !== 'Eliminated') {
      await prisma.event.create({
        data: {
          type: 'entrant_eliminated',
          title: `${entrant.wrestlerName || 'Entry #' + number} eliminated`,
          description: eliminatedBy ? `Eliminated by ${eliminatedBy}` : '',
          leagueId,
          data: { entrantId: entrant.id, eliminatedBy }
        }
      });
    }

    res.json({ success: true, entrant: updatedEntrant });

  } catch (error) {
    console.error('Error updating entrant:', error);
    res.status(500).json({ error: "Failed to update entrant" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;