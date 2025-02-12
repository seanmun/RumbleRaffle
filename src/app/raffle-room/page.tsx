"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the Participant type
interface Participant {
  name: string;
  entrants: number;
}

export default function RaffleRoom() {
  const [leagueName, setLeagueName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [shuffledEntrants, setShuffledEntrants] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>(Array(30).fill(""));
  const [raffleStarted, setRaffleStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Load league name and participants from localStorage
    const storedLeague = localStorage.getItem("currentLeague");
    const storedLeagueName = localStorage.getItem("currentLeagueName");

    if (storedLeagueName) {
      setLeagueName(JSON.parse(storedLeagueName)); // Parse the stored name
    }

    if (storedLeague) {
      try {
        const parsedParticipants: Participant[] = JSON.parse(storedLeague) as Participant[];
        setParticipants(parsedParticipants);
        generateEntrants(parsedParticipants);
      } catch (error) {
        console.error("Error parsing stored participants:", error);
        setParticipants([]); // Fallback to empty array
      }
    }
  }, []);

  const generateEntrants = (participants: Participant[]) => {
    let entrantList: string[] = [];
    participants.forEach((p) => {
      for (let i = 1; i <= p.entrants; i++) {
        entrantList.push(`${p.name} ${i}`);
      }
    });

    // Sort the left-side list alphabetically for fairness
    const sortedList = [...entrantList].sort();

    // Shuffle the actual raffle order
    const shuffledList = entrantList.sort(() => Math.random() - 0.5);

    setParticipants(sortedList.map((name) => ({ name, entrants: 1 }))); // Display sorted names
    setShuffledEntrants(shuffledList); // Store randomized order for raffle
  };

  const startRaffle = () => {
    setRaffleStarted(true);
    let index = -1; // Start at -1 so first update makes it 0

    const interval = setInterval(() => {
      index++; // Move to the next index before assigning

      if (index < 30) {
        setSlots((prevSlots) => {
          const newSlots = [...prevSlots];
          newSlots[index] = shuffledEntrants[index]; // Assign to correct index
          return newSlots;
        });

        setCurrentIndex(index + 1); // Display proper slot number
      } else {
        clearInterval(interval);
      }
    }, 2000); // 2 seconds per assignment
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Display League Name */}
      {leagueName && <h2 className="text-3xl font-bold text-yellow-400 mb-2">{leagueName}</h2>}
  
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">Raffle Room</h1>
  
      {/* Raffle Button at the Top */}
      {!raffleStarted ? (
        <button
          onClick={startRaffle}
          className="mb-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition"
        >
          Begin Raffle
        </button>
      ) : (
        <p className="mb-6 text-gray-300">Assigning entrants... {currentIndex} / 30</p>
      )}
  
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8">
        {/* Right Side - Raffle Slots (Stacks on top in mobile) */}
        <div className="w-full md:w-2/3 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Raffle Slots</h2>
          <div className="grid grid-cols-5 gap-2">
            {slots.slice(0, 30).map((slot, index) => ( // Ensure no extra slot #31
              <div key={index} className="p-4 bg-gray-700 rounded-md text-center">
                <span className="text-gray-400">#{index + 1}</span>
                <p className="text-white">{slot}</p>
              </div>
            ))}
          </div>
  
          {/* Show "Launch Live Tracker" button only after all 30 slots are filled */}
          {raffleStarted && currentIndex === 30 && (
            <button
              onClick={() => router.push("/live-tracker")}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition w-full"
            >
              Launch Live Tracker
            </button>
          )}
        </div>
  
        {/* Left Side - Participants (Moves below in mobile) */}
        <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Participants</h2>
          <ul>
            {participants.map((p, index) => (
              <li key={index} className="p-2 bg-gray-700 rounded-md mb-2 text-center">
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );  
}
