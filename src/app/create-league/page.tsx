"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateLeague() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [leagueName, setLeagueName] = useState("");
  const [numParticipants, setNumParticipants] = useState(2);
  const [participants, setParticipants] = useState<{ name: string; entrants: number }[]>([]);
  const [remainingEntrants, setRemainingEntrants] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://rumble-raffle.vercel.app";

  useEffect(() => {
    if (step === 2) {
      const autoEntrants = Math.floor(30 / numParticipants);
      setParticipants(Array.from({ length: numParticipants }, (_, i) => ({
        name: `Participant ${i + 1}`,
        entrants: autoEntrants,
      })));
    }
  }, [step, numParticipants]);

  useEffect(() => {
    const totalAssigned = participants.reduce((sum, p) => sum + p.entrants, 0);
    setRemainingEntrants(30 - totalAssigned);
  }, [participants]);

  const handleNextStep = () => {
    if (!leagueName.trim()) {
      alert("Please enter a league name.");
      return;
    }
    if (numParticipants < 2 || numParticipants > 30) {
      alert("Number of participants must be between 2 and 30.");
      return;
    }
    setStep(2);
  };

  const handleParticipantChange = (index: number, field: "name" | "entrants", value: string | number) => {
    const updatedParticipants = [...participants];
    if (field === "name") {
      updatedParticipants[index].name = value as string;
    } else {
      updatedParticipants[index].entrants = Number(value);
    }
    setParticipants(updatedParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingEntrants !== 0) {
      alert(`Total entrants must be exactly 30. Adjust by ${remainingEntrants > 0 ? "adding" : "removing"} ${Math.abs(remainingEntrants)} entrants.`);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/create-league`, { // ✅ Fix path by adding `/api/`
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leagueName, participants }),
      });

      if (!response.ok) {
        throw new Error("Failed to create league");
      }

      const data = await response.json();
      localStorage.setItem("currentLeague", JSON.stringify(participants));
      localStorage.setItem("currentLeagueName", JSON.stringify(leagueName));

      alert(`League Created! ID: ${data.leagueId}`);
      router.push("/raffle-room");

    } catch (error) {
      console.error("Error creating league:", error);
      alert("Failed to create league. Please try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {step === 1 && (
        <div className="w-96 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">Create a League</h1>
          <label className="block mb-4">
            League Name:
            <input
              type="text"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded"
              required
            />
          </label>

          <label className="block mb-4">
            Number of Participants:
            <input
              type="number"
              value={numParticipants}
              onChange={(e) => setNumParticipants(Number(e.target.value))}
              className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded"
              required
              min="2"
              max="30"
            />
          </label>

          <button
            onClick={handleNextStep}
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-500"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="w-96 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Assign Entrants</h2>

          <div className="bg-gray-700 text-gray-300 p-3 rounded-md mb-4 text-sm">
            <p>
              Each participant has been automatically assigned <b>{Math.floor(30 / numParticipants)}</b> entrants.
            </p>
            <p>
              There are <b>{remainingEntrants}</b> entrants left to distribute. Adjust as needed.
            </p>
          </div>

          <div className="grid grid-cols-[3fr_1fr] gap-4 text-gray-400 text-sm mb-2">
            <span>Participants</span>
            <span>Entrants</span>
          </div>

          {participants.map((participant, index) => (
            <div key={index} className="grid grid-cols-[3fr_1fr] gap-4 mb-2">
              <input
                type="text"
                value={participant.name}
                onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                className="p-2 bg-gray-700 border border-gray-600 rounded w-full"
                required
              />
              <select
                value={participant.entrants}
                onChange={(e) => handleParticipantChange(index, "entrants", e.target.value)}
                className="p-2 bg-gray-700 border border-gray-600 rounded w-full"
              >
                {[...Array(30).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <p className={`mt-4 text-sm ${remainingEntrants === 0 ? "text-green-400" : "text-red-400"}`}>
            Entrants Assigned: {30 - remainingEntrants} / 30
          </p>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-500">
            Create League
          </button>
        </form>
      )}
    </main>
  );
}
