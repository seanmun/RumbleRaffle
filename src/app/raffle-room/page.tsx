"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 🔹 Suspense wrapper for useSearchParams()
export default function RaffleRoom() {
  return (
    <Suspense fallback={<div className="text-gray-400">Loading raffle room...</div>}>
      <RaffleRoomContent />
    </Suspense>
  );
}

function RaffleRoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const leagueId = searchParams.get("leagueId");

  const [raffleStarted, setRaffleStarted] = useState(false);
  const [isRaffleComplete, setIsRaffleComplete] = useState(false);
  const [raffleInterval, setRaffleInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState<(string | null)[]>(Array(30).fill(null));
  const [participants, setParticipants] = useState<{ name: string; entrants: number }[]>([]);
  const [shuffledEntrants, setShuffledEntrants] = useState<string[]>([]);

  useEffect(() => {
    if (!leagueId) return;

    fetch(`${API_URL}/league/${leagueId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.participants) {
          setParticipants(data.participants);
        }
      })
      .catch(() => {
        const storedParticipants = localStorage.getItem("currentParticipants");
        if (storedParticipants) {
          setParticipants(JSON.parse(storedParticipants));
        }
      });
  }, [leagueId]);

  useEffect(() => {
    if (participants.length > 0) {
      const generatedEntrants = participants
        .flatMap((p) => Array(p.entrants).fill(p.name))
        .sort(() => Math.random() - 0.5);
      setShuffledEntrants(generatedEntrants);
    }
  }, [participants]);

  const startRaffle = () => {
    setRaffleStarted(true);
    setIsRaffleComplete(false);
    let index = -1;

    const interval = setInterval(() => {
      index++;
      if (index < 30) {
        setSlots((prevSlots) => {
          const newSlots = [...prevSlots];
          newSlots[index] = shuffledEntrants[index];
          return newSlots;
        });
        setCurrentIndex(index + 1);
      } else {
        clearInterval(interval);
        setIsRaffleComplete(true);
        saveRaffleResults();
      }
    }, 2000);

    setRaffleInterval(interval);
  };

  const finishRaffleNow = () => {
    if (raffleInterval) clearInterval(raffleInterval);

    setSlots(shuffledEntrants);
    setCurrentIndex(30);
    setIsRaffleComplete(true);
    saveRaffleResults();
  };

  const saveRaffleResults = async () => {
    if (!leagueId || shuffledEntrants.length !== 30) return;

    const entrants = shuffledEntrants.map((participant, index) => ({
      number: index + 1,
      participant,
    }));

    await fetch(`${API_URL}/assign-raffle-results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leagueId, entrants }),
    });
  };

  console.log("Fetching from API:", process.env.NEXT_PUBLIC_API_URL ?? "⚠️ API URL not found!");


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">Raffle Room</h1>

      {!raffleStarted ? (
        <div className="mb-6 flex gap-4">
          <button
            onClick={startRaffle}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition"
          >
            Begin Raffle
          </button>
          <button
            onClick={finishRaffleNow}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 transition"
          >
            Finish Now
          </button>
        </div>
      ) : (
        <p className="mb-6 text-gray-300">Assigning entrants... {currentIndex} / 30</p>
      )}

      <div className="grid grid-cols-2 gap-8 mt-6">
        <div className="grid grid-cols-5 gap-4">
          {slots.map((entrant, index) => (
            <div
              key={index}
              className={`p-4 bg-gray-800 rounded-lg shadow-md text-center ${
                entrant ? "text-white" : "text-gray-400"
              }`}
            >
              <p className="font-bold">#{index + 1}</p>
              <p>{entrant || "Waiting..."}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Participants</h2>
          <ul className="text-gray-300">
            {shuffledEntrants.map((entrant, index) => (
              <li key={index} className="p-2 border-b border-gray-700">
                {index + 1}. {entrant}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isRaffleComplete && (
        <button
          onClick={() => router.push(`/live-tracker?leagueId=${leagueId}`)}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition"
        >
          Go to Live Tracker
        </button>
      )}
    </main>
  );
}
