"use client";
import { useState, useEffect } from "react";

interface Wrestler {
  name: string;
  image: string;
}

interface Entrant {
  number: number;
  participant: string;
  wrestler?: Wrestler | null;
}

export default function LiveTracker() {
  const [entrants, setEntrants] = useState<Entrant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Wrestler[]>([]);
  const [activeEntrant, setActiveEntrant] = useState<number | null>(null);

  useEffect(() => {
    const storedEntrants = localStorage.getItem("liveTrackerEntrants");
    if (storedEntrants) {
      setEntrants(JSON.parse(storedEntrants));
    } else {
      const initialEntrants = Array.from({ length: 30 }, (_, i) => ({
        number: i + 1,
        participant: `Participant ${i + 1}`,
        wrestler: null,
      }));
      setEntrants(initialEntrants);
      localStorage.setItem("liveTrackerEntrants", JSON.stringify(initialEntrants));
    }
  }, []);

  const handleWrestlerClick = (index: number) => {
    setActiveEntrant(index);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Simulated wrestler database search (replace with real API later)
    const wrestlers = [
      { name: "John Cena", image: "/images/cena.jpg" },
      { name: "The Rock", image: "/images/rock.jpg" },
      { name: "Stone Cold Steve Austin", image: "/images/austin.jpg" },
      { name: "Triple H", image: "/images/hhh.jpg" },
      { name: "Roman Reigns", image: "/images/reigns.jpg" },
    ];
    setSearchResults(
      wrestlers.filter((w) => w.name.toLowerCase().includes(e.target.value.toLowerCase()))
    );
  };

  const selectWrestler = (wrestler: Wrestler) => {
    if (activeEntrant !== null) {
      const updatedEntrants = [...entrants];
      updatedEntrants[activeEntrant].wrestler = wrestler;
      setEntrants(updatedEntrants);
      localStorage.setItem("liveTrackerEntrants", JSON.stringify(updatedEntrants));
      setActiveEntrant(null);
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Royal Rumble Live Tracker</h1>

      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="text-gray-400">Entrant #</div>
        <div className="text-gray-400">Participant</div>
        <div className="text-gray-400">Wrestler</div>

        {entrants.map((entrant, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-center">
            <span className="text-gray-300">{entrant.number}</span>
            <span className="text-gray-300">{entrant.participant}</span>
            {entrant.wrestler ? (
              <span className="text-white">{entrant.wrestler.name}</span>
            ) : (
              <button
                onClick={() => handleWrestlerClick(index)}
                className="p-2 bg-gray-700 rounded text-gray-400"
              >
                Assign Wrestler
              </button>
            )}
          </div>
        ))}
      </div>

      {activeEntrant !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Select Wrestler</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 bg-gray-700 text-white rounded mb-4"
              placeholder="Search for a wrestler..."
            />
            <ul>
              {searchResults.map((wrestler, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                  onClick={() => selectWrestler(wrestler)}
                >
                  {wrestler.name}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setActiveEntrant(null)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
