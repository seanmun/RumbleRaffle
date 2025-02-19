"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface WrestlerSearchProps {
  onSelect: (name: string) => void;
  onClose?: () => void; 
}

export default function WrestlerSearch({ onSelect, onClose }: WrestlerSearchProps) {
  const [query, setQuery] = useState("");
  const [filteredWrestlers, setFilteredWrestlers] = useState<string[]>([]);
  const [allWrestlers, setAllWrestlers] = useState<string[]>([]);

  // Fetch wrestlers from the backend
  useEffect(() => {
    fetch(`${API_URL}/api/wrestlers`)
      .then((res) => res.json())
      .then((data) => setAllWrestlers(data))
      .catch(() => console.error("❌ Failed to load wrestlers"));
  }, []);

  useEffect(() => {
    setFilteredWrestlers(
      allWrestlers.filter((wrestler) =>
        wrestler.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, allWrestlers]);

  const handleSelect = (wrestler: string) => {
    onSelect(wrestler);
    if (onClose) onClose();
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
        placeholder="Search Wrestlers or Enter Custom Name..."
      />

      {/* If user has typed something, show dropdown */}
      {query && (
        <ul className="absolute left-0 top-full bg-gray-800 border border-gray-600 rounded mt-1 max-h-48 overflow-auto z-10">
          {/* Filtered results */}
          {filteredWrestlers.map((wrestler, index) => (
            <li
              key={index}
              onClick={() => handleSelect(wrestler)}
              className="p-2 hover:bg-gray-700 cursor-pointer"
            >
              {wrestler}
            </li>
          ))}

          {/* Show a 'custom name' option if there's no exact match */}
          {!filteredWrestlers.includes(query) && (
            <li
              onClick={() => handleSelect(query)}
              className="p-2 hover:bg-gray-700 cursor-pointer text-blue-400"
            >
              Use custom name: <strong>{query}</strong>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
