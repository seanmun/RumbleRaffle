"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Home() {
  const [message, setMessage] = useState("Loading...");
  const router = useRouter(); // Initialize router

  // ✅ Dynamically set the API URL (works for both local & Vercel)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${API_URL}/test`) // ✅ Removed `/api/`
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage("✅ Backend is connected!");
        } else {
          throw new Error("Invalid response");
        }
      })
      .catch(() => setMessage("⚠️ Failed to connect to the backend"));
  }, [API_URL]); // ✅ Now React will re-run the effect if API_URL changes

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-6">
      <h1 className="text-5xl font-bold text-yellow-400">Rumble Raffle</h1>
      <p className="mt-4 text-xl text-gray-300">The ultimate Royal Rumble betting experience.</p>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
        <p className={`text-lg ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      </div>

      <button
        onClick={() => router.push("/create-league")} // Navigate on click
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition"
      >
        Create a League
      </button>

      <button
        onClick={() => router.push("/leagues")}
        className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition"
      >
        View Leagues
      </button>
    </main>
  );
}
