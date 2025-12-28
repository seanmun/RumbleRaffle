import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Historical Royal Rumble data (2024 Men's Royal Rumble for testing)
const royalRumble2024Data = {
  name: "Royal Rumble 2024 (Men)",
  year: 2024,
  eventType: "royal_rumble",
  eventDate: new Date("2024-01-27T20:00:00Z"),
  status: "completed",
  description: "2024 Royal Rumble Match - Men's Division",
  entrants: [
    { number: 1, name: "Gunther", placement: 2 },
    { number: 2, name: "Dominik Mysterio", placement: 18 },
    { number: 3, name: "Ludwig Kaiser", placement: 8 },
    { number: 4, name: "Kofi Kingston", placement: 6 },
    { number: 5, name: "Xavier Woods", placement: 10 },
    { number: 6, name: "Ivar", placement: 13 },
    { number: 7, name: "Grayson Waller", placement: 11 },
    { number: 8, name: "Austin Theory", placement: 9 },
    { number: 9, name: "Bobby Lashley", placement: 15 },
    { number: 10, name: "JD McDonagh", placement: 12 },
    { number: 11, name: "Finn Balor", placement: 7 },
    { number: 12, name: "Damian Priest", placement: 14 },
    { number: 13, name: "Karrion Kross", placement: 17 },
    { number: 14, name: "Shinsuke Nakamura", placement: 20 },
    { number: 15, name: "Cody Rhodes", placement: 1 }, // Winner
    { number: 16, name: "Jinder Mahal", placement: 16 },
    { number: 17, name: "Bron Breakker", placement: 19 },
    { number: 18, name: "Ricochet", placement: 22 },
    { number: 19, name: "Jimmy Uso", placement: 21 },
    { number: 20, name: "Logan Paul", placement: 4 },
    { number: 21, name: "LA Knight", placement: 5 },
    { number: 22, name: "AJ Styles", placement: 23 },
    { number: 23, name: "Andrade", placement: 24 },
    { number: 24, name: "Trick Williams", placement: 25 },
    { number: 25, name: "Bronson Reed", placement: 26 },
    { number: 26, name: "Omos", placement: 27 },
    { number: 27, name: "Sami Zayn", placement: 3 },
    { number: 28, name: "Drew McIntyre", placement: 28 },
    { number: 29, name: "Santos Escobar", placement: 29 },
    { number: 30, name: "CM Punk", placement: 30 },
  ]
}

// Royal Rumble 2025 (upcoming)
const royalRumble2025Data = {
  name: "Royal Rumble 2025 (Men)",
  year: 2025,
  eventType: "royal_rumble",
  eventDate: new Date("2025-02-01T20:00:00Z"),
  status: "upcoming",
  description: "2025 Royal Rumble Match - Men's Division",
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.globalEntrant.deleteMany()
  await prisma.event.deleteMany()

  // Create 2024 Royal Rumble event
  console.log('📅 Creating Royal Rumble 2024 event...')
  const event2024 = await prisma.event.create({
    data: {
      name: royalRumble2024Data.name,
      year: royalRumble2024Data.year,
      eventType: royalRumble2024Data.eventType,
      eventDate: royalRumble2024Data.eventDate,
      status: royalRumble2024Data.status,
      description: royalRumble2024Data.description,
    },
  })

  // Create entrants for 2024
  console.log('👥 Creating 30 entrants for Royal Rumble 2024...')
  for (const entrant of royalRumble2024Data.entrants) {
    const baseTime = new Date("2024-01-27T20:00:00Z")
    const enteredAt = new Date(baseTime.getTime() + (entrant.number - 1) * 2 * 60 * 1000) // Every 2 minutes
    const eliminatedAt = new Date(baseTime.getTime() + (entrant.placement + 29) * 2 * 60 * 1000)

    await prisma.globalEntrant.create({
      data: {
        eventId: event2024.id,
        entrantNumber: entrant.number,
        wrestlerName: entrant.name,
        isEliminated: true,
        finalPlacement: entrant.placement,
        enteredAt,
        eliminatedAt,
      },
    })
  }

  // Create 2025 Royal Rumble event (upcoming)
  console.log('📅 Creating Royal Rumble 2025 event (upcoming)...')
  const event2025 = await prisma.event.create({
    data: {
      name: royalRumble2025Data.name,
      year: royalRumble2025Data.year,
      eventType: royalRumble2025Data.eventType,
      eventDate: royalRumble2025Data.eventDate,
      status: royalRumble2025Data.status,
      description: royalRumble2025Data.description,
    },
  })

  // Create placeholder entrants for 2025 (TBD)
  console.log('👥 Creating 30 placeholder entrants for Royal Rumble 2025...')
  for (let i = 1; i <= 30; i++) {
    await prisma.globalEntrant.create({
      data: {
        eventId: event2025.id,
        entrantNumber: i,
        wrestlerName: "TBD",
        isEliminated: false,
      },
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 2 Events (Royal Rumble 2024 & 2025)`)
  console.log(`   - 60 Global Entrants (30 per event)`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
