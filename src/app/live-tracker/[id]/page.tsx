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
  eliminatedAt?: string;
  eliminatedBy?: string;
}

interface League {
  id: string;
  name: string;
  participants: Participant[];
  events: Event[];
}

interface Event {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

export default function LiveTrackerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntrant, setSelectedEntrant] = useState<number | null>(null);
  const [wrestlerSearch, setWrestlerSearch] = useState("");
  const [customWrestler, setCustomWrestler] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 
    (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");


    // Auto-refresh every 5 minutes
useEffect(() => {
  const interval = setInterval(() => {
    const fetchLeague = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}`);
        if (!response.ok) throw new Error('League not found');
        const data = await response.json();
        setLeague(data);
      } catch (err) {
        console.error('Error fetching league:', err);
      }
    };
    fetchLeague();
  }, 1 * 60 * 1000); // 5 minutes

  return () => clearInterval(interval);
}, [resolvedParams.id, API_URL]);

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}`);
        if (!response.ok) throw new Error('League not found');
        const data = await response.json();
        setLeague(data);
      } catch (err) {
        console.error('Error fetching league:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [resolvedParams.id, API_URL]);

  // Create participant lookup map
  const participantMap = new Map(
    league?.participants.map((p: Participant) => [p.id, p.name]) || []
  );

  // Get all entrants in order
  const allEntrants: Entrant[] = league?.participants
    .flatMap((p: Participant) => p.entrants || [])
    .sort((a: Entrant, b: Entrant) => a.number - b.number) || [];

  const activeEntrants = allEntrants.filter((e: Entrant) => e.status === 'Active');
  const eliminatedEntrants = allEntrants.filter((e: Entrant) => e.status === 'Eliminated');

  const handleAssignWrestler = async (wrestlerName: string) => {
    if (!selectedEntrant) return;

    try {
      const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}/entrants/${selectedEntrant}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wrestlerName })
      });

      if (response.ok) {
        const leagueResponse = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}`);
        const updatedLeague = await leagueResponse.json();
        setLeague(updatedLeague);
        setSelectedEntrant(null);
        setShowCustomInput(false);
        setCustomWrestler("");
        setWrestlerSearch("");
      }
    } catch (error) {
      console.error('Error assigning wrestler:', error);
    }
  };

  const handleEliminate = async (entrantNumber: number) => {
    const entrant = allEntrants.find(e => e.number === entrantNumber);
    if (!entrant) return;

    if (!confirm(`Eliminate ${entrant.wrestlerName} (#${entrantNumber})?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}/entrants/${entrantNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Eliminated' })
      });

      if (response.ok) {
        const leagueResponse = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}`);
        const updatedLeague = await leagueResponse.json();
        setLeague(updatedLeague);
        
        // Check for winner
        const newActiveEntrants = updatedLeague.participants
          .flatMap((p: Participant) => p.entrants || [])
          .filter((e: Entrant) => e.status === 'Active');
          
        if (newActiveEntrants.length === 1) {
          const winner = newActiveEntrants[0];
          const participantName = participantMap.get(winner.participantId);
          setTimeout(() => {
            alert(`🎉 WINNER! ${winner.wrestlerName} (#${winner.number}) - ${participantName} wins the league! 🏆`);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error eliminating entrant:', error);
    }
  };

  const handleUndoElimination = async (entrantNumber: number) => {
    const entrant = allEntrants.find(e => e.number === entrantNumber);
    if (!entrant) return;

    if (!confirm(`Bring back ${entrant.wrestlerName} (#${entrantNumber})?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}/entrants/${entrantNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Active' })
      });

      if (response.ok) {
        const leagueResponse = await fetch(`${API_URL}/api/leagues/${resolvedParams.id}`);
        const updatedLeague = await leagueResponse.json();
        setLeague(updatedLeague);
      }
    } catch (error) {
      console.error('Error undoing elimination:', error);
    }
  };

  const filteredWrestlers = wrestlers.filter(wrestler =>
    wrestler.toLowerCase().includes(wrestlerSearch.toLowerCase())
  );

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-xl">Loading tracker...</div>
      </main>
    );
  }

  if (!league) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-xl text-red-400">League not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
{/* Header */}
<div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
  <div className="max-w-7xl mx-auto px-4 py-6">
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-red-400 font-semibold">LIVE</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{league.name}</h1>
      <div className="flex justify-center items-center gap-8 text-lg mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-blue-400 font-semibold">{activeEntrants.length} Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
          <span className="text-slate-400 font-semibold">{eliminatedEntrants.length} Eliminated</span>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
      >
        🔄 Refresh
      </button>
    </div>
  </div>
</div>

    {/* Winner Banner */}
    {activeEntrants.length === 1 && (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-4">
        <div className="text-2xl font-bold">
        🏆 WINNER: {activeEntrants[0].wrestlerName} #{activeEntrants[0].number} 🏆
        </div>
        <div className="text-lg">
        {participantMap.get(activeEntrants[0].participantId)} takes the championship!
        </div>
    </div>
    )}

      {/* Entrants Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {allEntrants.map((entrant) => (
            <div
              key={entrant.id}
              className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                entrant.status === 'Active' 
                  ? 'bg-slate-800 border-slate-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/20' 
                  : 'bg-slate-900 border-slate-700 opacity-50'
              }`}
            >
              {/* Entry Number Badge */}
              <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                entrant.status === 'Active' ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'
              }`}>
                {entrant.number}
              </div>

              {/* Status Badge */}
              {entrant.status === 'Eliminated' && (
                <div className="absolute top-2 right-2 bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded-full font-semibold">
                  OUT
                </div>
              )}

              <div className="p-4 pt-12">
                {/* Participant Name */}
                <div className={`text-xs mb-2 text-center ${
                  entrant.status === 'Active' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {participantMap.get(entrant.participantId)}
                </div>

                {/* Wrestler Name */}
                <div className="text-center mb-4">
                  <div className={`font-semibold text-sm min-h-[2.5rem] flex items-center justify-center ${
                    entrant.status === 'Eliminated' 
                      ? 'text-slate-500 line-through' 
                      : entrant.wrestlerName === 'TBD' 
                        ? 'text-slate-500 italic' 
                        : 'text-white'
                  }`}>
                    {entrant.wrestlerName}
                  </div>
                </div>

                {/* Action Buttons */}
                {entrant.status === 'Active' ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedEntrant(entrant.number)}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors"
                    >
                      {entrant.wrestlerName === 'TBD' ? '+ Assign' : '✏ Change'}
                    </button>
                    <button
                      onClick={() => handleEliminate(entrant.number)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors"
                    >
                      ❌ Eliminate
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUndoElimination(entrant.number)}
                    className="w-full bg-slate-600 hover:bg-slate-500 text-slate-300 text-xs py-2 px-3 rounded-lg font-medium transition-colors"
                  >
                    ↩ Undo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wrestler Selection Modal */}
      {selectedEntrant && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-600 p-6 max-w-md w-full max-h-[80vh] flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-center">
              Assign Wrestler to #{selectedEntrant}
            </h3>
            
            {!showCustomInput ? (
              <>
                <input
                  type="text"
                  placeholder="Search wrestlers..."
                  value={wrestlerSearch}
                  onChange={(e) => setWrestlerSearch(e.target.value)}
                  className="w-full p-3 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
                  autoFocus
                />
                
                <div className="flex-1 overflow-y-auto mb-4 max-h-64">
                  <div className="space-y-1">
                    {filteredWrestlers.slice(0, 20).map((wrestler) => (
                      <button
                        key={wrestler}
                        onClick={() => handleAssignWrestler(wrestler)}
                        className="w-full text-left p-3 hover:bg-slate-700 rounded-lg transition-colors text-white"
                      >
                        {wrestler}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg font-semibold mb-3 transition-colors"
                >
                  ➕ Add Custom Wrestler
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter custom wrestler name..."
                  value={customWrestler}
                  onChange={(e) => setCustomWrestler(e.target.value)}
                  className="w-full p-3 mb-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleAssignWrestler(customWrestler)}
                  disabled={!customWrestler.trim()}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold mb-3 transition-colors"
                >
                  Assign Custom Wrestler
                </button>
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="w-full bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-lg font-semibold mb-3 transition-colors"
                >
                  ← Back to List
                </button>
              </>
            )}
            
            <button
              onClick={() => {
                setSelectedEntrant(null);
                setShowCustomInput(false);
                setCustomWrestler("");
                setWrestlerSearch("");
              }}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}