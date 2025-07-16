"use client";
import { useState, useEffect, use } from "react";
import { wrestlers } from "../../api/wrestlers";

interface Participant {
  id: string;
  name: string;
  entryCount: number;
  entrants: Entrant[];
}

interface Entrant {
  id: string;
  number: number;
  wrestlerName: string;
  status: string;
  participantId: string;
}

interface League {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  participants: Participant[];
  events: Event[];
}

interface Event {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

export default function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [selectedEntrant, setSelectedEntrant] = useState<number | null>(null);
  const [wrestlerSearch, setWrestlerSearch] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 
    (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error('League not found');
        }
        
        const data = await response.json();
        setLeague(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load league');
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [resolvedParams.id, API_URL]);

  // Check if numbers have been drawn (randomized)
  const hasBeenRandomized = league?.events?.some(event => event.type === 'entrants_randomized') || false;

  const handleRandomize = async () => {
    if (!confirm('Are you sure you want to draw the entry numbers? This cannot be undone!')) {
      return;
    }

    setIsRandomizing(true);

    try {
      const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}/randomize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Numbers drawn successfully!');
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error drawing numbers:', error);
      alert('Failed to draw numbers');
    } finally {
      setIsRandomizing(false);
    }
  };

  const handleEntrantClick = (entrantNumber: number) => {
    if (!hasBeenRandomized) return;
    setSelectedEntrant(entrantNumber);
    setWrestlerSearch("");
  };

  const handleWrestlerSelect = async (wrestlerName: string) => {
    if (!selectedEntrant) return;

    try {
      const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}/entrants/${selectedEntrant}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wrestlerName })
      });

      if (response.ok) {
        // Refresh the league data
        const leagueResponse = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}`);
        const updatedLeague = await leagueResponse.json();
        setLeague(updatedLeague);
        setSelectedEntrant(null);
      } else {
        alert('Failed to assign wrestler');
      }
    } catch (error) {
      console.error('Error assigning wrestler:', error);
      alert('Failed to assign wrestler');
    }
  };

  const filteredWrestlers = wrestlers.filter(wrestler =>
    wrestler.toLowerCase().includes(wrestlerSearch.toLowerCase())
  );

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div>Loading league...</div>
      </main>
    );
  }

  if (error || !league) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
          <p>{error || 'League not found'}</p>
        </div>
      </main>
    );
  }

  // Create participant lookup map
  const participantMap = new Map(
    league.participants.map(p => [p.id, p.name])
  );

  // Get all entrants in order
  const allEntrants = league.participants
    .flatMap(p => p.entrants)
    .sort((a, b) => a.number - b.number);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">{league.name}</h1>
          <p className="text-gray-300">League ID: {league.id}</p>
          <p className="text-gray-400">Status: {league.status}</p>
          
          {!hasBeenRandomized && (
            <div className="mt-6 p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Ready to Draw Numbers?</h3>
              <p className="text-gray-300 mb-6">
                Click the button below to randomly assign entry numbers to all participants. 
                This can only be done once!
              </p>
              <button
                onClick={handleRandomize}
                disabled={isRandomizing}
                className={`px-8 py-3 rounded-lg font-bold text-lg ${
                  isRandomizing 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-500'
                } text-white`}
              >
                {isRandomizing ? '🎲 Drawing Numbers...' : '🎲 Draw Entry Numbers'}
              </button>
            </div>
          )}

          {hasBeenRandomized && (
            <div className="mt-4 p-4 bg-green-800 rounded-lg">
              <p className="text-green-200">✅ Entry numbers have been drawn!</p>
              <button
                onClick={() => window.open(`/live-tracker/${resolvedParams.id}`, '_blank')}
                className="mt-3 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-semibold"
              >
                📺 Open Live Tracker
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Participants Summary */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Participants</h2>
            {league.participants.map((participant) => (
              <div key={participant.id} className="mb-3 p-3 bg-gray-700 rounded">
                <div className="font-semibold">{participant.name}</div>
                <div className="text-sm text-gray-400">{participant.entryCount} entries</div>
              </div>
            ))}
          </div>

          {/* Entrants Grid */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              {hasBeenRandomized ? 'Entry Numbers (1-30)' : 'Entry Numbers'}
            </h2>
            
            {!hasBeenRandomized ? (
              <div className="text-center text-gray-400 py-8">
                <p>Entry numbers will appear after drawing</p>
                <div className="text-6xl mt-4">🎲</div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {allEntrants.map((entrant) => (
                  <div
                    key={entrant.id}
                    onClick={() => handleEntrantClick(entrant.number)}
                    className={`p-2 rounded text-center text-sm cursor-pointer transition-all ${
                      entrant.status === 'Active' 
                        ? 'bg-green-700 hover:bg-green-600' 
                        : 'bg-red-700 opacity-50'
                    } ${selectedEntrant === entrant.number ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    <div className="font-bold">#{entrant.number}</div>
                    <div className="text-xs">{participantMap.get(entrant.participantId)}</div>
                    <div className="text-xs mt-1 font-semibold">
                      {entrant.wrestlerName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wrestler Selection Modal */}
        {selectedEntrant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96">
              <h3 className="text-xl font-bold mb-4">Assign Wrestler to #{selectedEntrant}</h3>
              
              <input
                type="text"
                placeholder="Search wrestlers..."
                value={wrestlerSearch}
                onChange={(e) => setWrestlerSearch(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded"
                autoFocus
              />
              
              <div className="max-h-48 overflow-y-auto">
                {filteredWrestlers.slice(0, 20).map((wrestler) => (
                  <button
                    key={wrestler}
                    onClick={() => handleWrestlerSelect(wrestler)}
                    className="w-full text-left p-2 hover:bg-gray-700 rounded"
                  >
                    {wrestler}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setSelectedEntrant(null)}
                className="mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}