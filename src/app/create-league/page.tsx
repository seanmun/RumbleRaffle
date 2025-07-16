"use client";
import { useState, useEffect } from "react";

interface Participant {
  name: string;
  entrants: number;
}

export default function CreateLeague() {
  const [step, setStep] = useState(1);
  const [leagueName, setLeagueName] = useState("");
  const [numParticipants, setNumParticipants] = useState(2);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [remainingEntrants, setRemainingEntrants] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 
    (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

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
    setLoading(true);

    if (remainingEntrants !== 0) {
      alert(`Total entrants must be exactly 30. Adjust by ${remainingEntrants > 0 ? "adding" : "removing"} ${Math.abs(remainingEntrants)} entrants.`);
      setLoading(false);
      return;
    }

    try {
      console.log("📡 Sending Create League Request to:", `${API_URL}/api/create-league`);
      
      const response = await fetch(`${API_URL}/api/create-league`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leagueName, participants }),
      });

      const data = await response.json();
      console.log("✅ Response from Server:", data);

      if (data.leagueId) {
        alert(`League Created! ID: ${data.leagueId}`);
        // For now, just show the league ID - we'll create the league page next
        console.log("League created with ID:", data.leagueId);
      } else {
        alert("⚠️ Error creating league. Please try again.");
      }
    } catch (error) {
      console.error("🚨 Create League Failed:", error);
      alert("⚠️ Network error. Please check the console for details.");
    }

    setLoading(false);
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
            <p>Each participant has been automatically assigned <b>{Math.floor(30 / numParticipants)}</b> entrants.</p>
            <p>There are <b>{remainingEntrants}</b> entrants left to distribute. Adjust as needed.</p>
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

          <button
            type="submit"
            className={`w-full py-2 rounded mt-4 transition ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create League"}
          </button>
        </form>
      )}
    </main>
  );
}