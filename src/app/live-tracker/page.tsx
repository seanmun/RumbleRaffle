"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ToggleLeft, ToggleRight, Pencil } from "lucide-react";
import WrestlerSearch from "@/components/WrestlerSearch";

interface Entrant {
  number: number;
  participant: string;
  name: string;
  status: "Active" | "Eliminated";
}

// 🔹 Wrapper Component with Suspense to handle useSearchParams
export default function LiveTracker() {
  return (
    <Suspense fallback={<div className="text-gray-400">Loading live tracker...</div>}>
      <LiveTrackerContent />
    </Suspense>
  );
}

function LiveTrackerContent() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("leagueId");

  const [entrants, setEntrants] = useState<Entrant[]>([]);
  const [editingEntrant, setEditingEntrant] = useState<number | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    if (leagueId) {
      fetch(`${API_URL}/live-tracker?leagueId=${leagueId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setEntrants(data);
          } else {
            console.error("🚨 Invalid data format:", data);
            setEntrants([]);
          }
        })
        .catch((error) => {
          console.error("❌ Failed to load live tracker data:", error);
          setEntrants([]);
        });
    }
  }, [leagueId, API_URL]);

  const toggleStatus = async (entrantNumber: number) => {
    const updatedEntrants: Entrant[] = entrants.map((entrant) =>
      entrant.number === entrantNumber
        ? { ...entrant, status: entrant.status === "Active" ? "Eliminated" : "Active" }
        : entrant
    );

    setEntrants(updatedEntrants);

    try {
      await fetch(`${API_URL}/live-tracker/toggle-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leagueId, entrantNumber }),
      });
    } catch (error) {
      console.error("❌ Failed to update status:", error);
    }
  };

  const updateWrestlerName = async (entrantNumber: number, newName: string) => {
    const updatedEntrants = entrants.map((entrant) =>
      entrant.number === entrantNumber ? { ...entrant, name: newName } : entrant
    );

    setEntrants(updatedEntrants);
    setEditingEntrant(null);

    try {
      await fetch(`${API_URL}/live-tracker/update-wrestler`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leagueId, entrantNumber, newName }),
      });
    } catch (error) {
      console.error("❌ Failed to update wrestler name:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400">Live Tracker</h1>
      <p className="mt-2 text-gray-300">Tracking the action for your league!</p>

      <table className="mt-6 w-full max-w-2xl border-collapse border border-gray-700 text-left">
        <thead>
          <tr className="bg-gray-800 text-yellow-400">
            <th className="p-3 border border-gray-700">#</th>
            <th className="p-3 border border-gray-700">Participant</th>
            <th className="p-3 border border-gray-700">Wrestler Name</th>
            <th className="p-3 border border-gray-700">Status</th>
            <th className="p-3 border border-gray-700">Edit</th>
          </tr>
        </thead>
        <tbody>
          {entrants.length > 0 ? (
            entrants.map((entrant) => (
              <tr
                key={entrant.number}
                className={`border border-gray-700 ${entrant.status === "Eliminated" ? "opacity-50 bg-gray-700" : ""}`}
              >
                <td className="p-3">{entrant.number}</td>
                <td className="p-3">{entrant.participant}</td>
                <td className="p-3">
                  {editingEntrant === entrant.number ? (
                    <WrestlerSearch 
                      onSelect={(name) => updateWrestlerName(entrant.number, name)}
                      onClose={() => setEditingEntrant(null)} 
                    />
                  ) : (
                    entrant.name
                  )}
                </td>
                <td className="p-3">
                  <button onClick={() => toggleStatus(entrant.number)} className="focus:outline-none">
                    {entrant.status === "Active" ? (
                      <ToggleRight className="text-green-500 w-6 h-6" />
                    ) : (
                      <ToggleLeft className="text-red-500 w-6 h-6" />
                    )}
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => setEditingEntrant(entrant.number)} className="text-blue-400 hover:underline">
                    <Pencil className="w-5 h-5 text-blue-400 hover:text-blue-300" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 p-4">
                Loading entrants...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
