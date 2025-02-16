"use client";
import { useEffect, useState } from "react";

export default function Leagues() {
  const [leagues, setLeagues] = useState<{ leagueId: string; leagueName: string }[]>([]);

  const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

  useEffect(() => {
    fetch(`${API_URL}/api/leagues`) // 🔥 Removed `/api/` to match backend
      .then((res) => res.json())
      .then((data) => setLeagues(data))
      .catch(() => setLeagues([]));
  }, [API_URL]); // ✅ React will re-run the effect if API_URL changes

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400">Leagues</h1>

      {leagues.length === 0 ? (
        <p className="mt-4 text-gray-400">No leagues found.</p>
      ) : (
        <ul className="mt-6 w-full max-w-md">
          {leagues.map((league) => (
            <li key={league.leagueId} className="p-4 bg-gray-800 rounded-lg shadow-md mb-4">
              <p className="text-lg font-semibold">{league.leagueName}</p>
              <p className="text-sm text-gray-400">ID: {league.leagueId}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
