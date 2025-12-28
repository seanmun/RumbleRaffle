'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type League = {
  id: string
  name: string
  buy_in: number
  creator_id: string
  league_type: 'winner_takes_all' | 'points_based' | 'combined'
  event_id: string
  secondary_event_id?: string
  events?: { id: string }
}

type Participant = {
  id: string
  name: string
  entrant_count: number
  total_buy_in: number
}

type GlobalEntrant = {
  id: string
  entrant_number: number
  wrestler_name: string
  event_id: string
}

export default function LeagueSetupPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const leagueId = params.id as string

  const [league, setLeague] = useState<League | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [availableEntrants, setAvailableEntrants] = useState<GlobalEntrant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add participant form
  const [newParticipantName, setNewParticipantName] = useState('')

  // Calculate suggested even distribution
  const totalEntrants = participants.reduce((sum, p) => sum + p.entrant_count, 0)
  const remainingEntrants = availableEntrants.length - totalEntrants
  const evenDistribution = participants.length > 0 ? Math.floor(availableEntrants.length / participants.length) : 0

  useEffect(() => {
    loadLeagueData()
  }, [leagueId])

  async function loadLeagueData() {
    try {
      // Load league details
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single()

      if (leagueError) {
        console.error('League error:', leagueError)
        throw leagueError
      }

      setLeague(leagueData)

      // Load participants
      const { data: participantsData } = await supabase
        .from('participants')
        .select('*')
        .eq('league_id', leagueId)
        .order('created_at', { ascending: true })

      setParticipants(participantsData || [])

      // Load available entrants for the event(s)
      // For combined leagues, we need entrants from both events
      let entrantsQuery = supabase
        .from('global_entrants')
        .select('*')

      if (leagueData.league_type === 'combined' && leagueData.secondary_event_id) {
        entrantsQuery = entrantsQuery.in('event_id', [leagueData.event_id, leagueData.secondary_event_id])
      } else {
        entrantsQuery = entrantsQuery.eq('event_id', leagueData.event_id)
      }

      const { data: entrantsData } = await entrantsQuery.order('entrant_number', { ascending: true })

      setAvailableEntrants(entrantsData || [])

      setLoading(false)
    } catch (err) {
      console.error('Load error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load league')
      setLoading(false)
    }
  }

  async function handleAddParticipant(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase
        .from('participants')
        .insert({
          league_id: leagueId,
          user_id: user.id,
          name: newParticipantName,
          entrant_count: 0,
          total_buy_in: 0
        })

      if (insertError) throw insertError

      // Reload participants
      await loadLeagueData()

      // Clear form
      setNewParticipantName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add participant')
    }
  }

  async function handleUpdateEntrantCount(participantId: string, newCount: number) {
    setError(null)

    try {
      const totalBuyIn = league ? league.buy_in * newCount : 0

      const { error: updateError } = await supabase
        .from('participants')
        .update({
          entrant_count: newCount,
          total_buy_in: totalBuyIn
        })
        .eq('id', participantId)

      if (updateError) throw updateError

      // Reload participants
      await loadLeagueData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entrant count')
    }
  }

  async function handleDistributeEvenly() {
    if (participants.length === 0) return

    setError(null)

    try {
      const evenCount = Math.floor(availableEntrants.length / participants.length)

      for (const participant of participants) {
        await handleUpdateEntrantCount(participant.id, evenCount)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to distribute evenly')
    }
  }

  async function handleDeleteParticipant(participantId: string) {
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId)

      if (deleteError) throw deleteError

      // Reload participants
      await loadLeagueData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete participant')
    }
  }

  async function handleRandomAssignment() {
    setError(null)

    try {
      // Calculate total entrants needed
      const totalNeeded = participants.reduce((sum, p) => sum + p.entrant_count, 0)

      if (totalNeeded === 0) {
        setError('Please assign entrant counts to participants first')
        return
      }

      if (totalNeeded > availableEntrants.length) {
        setError(`Not enough entrants available. Need ${totalNeeded}, have ${availableEntrants.length}`)
        return
      }

      // Shuffle entrants
      const shuffled = [...availableEntrants].sort(() => Math.random() - 0.5)

      // Assign to participants
      let currentIndex = 0
      for (const participant of participants) {
        if (participant.entrant_count === 0) continue // Skip participants with 0 entrants

        const assignments = []
        for (let i = 0; i < participant.entrant_count; i++) {
          const entrant = shuffled[currentIndex]
          if (!entrant) {
            throw new Error(`Not enough entrants to assign. Missing entrant at index ${currentIndex}`)
          }
          assignments.push({
            league_id: leagueId,
            participant_id: participant.id,
            global_entrant_id: entrant.id,
            entrant_number: entrant.entrant_number,
            event_id: entrant.event_id
          })
          currentIndex++
        }

        // Only insert if there are assignments
        if (assignments.length > 0) {
          const { error: assignError } = await supabase
            .from('league_entrant_assignments')
            .insert(assignments)

          if (assignError) {
            console.error('Assignment error:', assignError)
            throw new Error(`Failed to assign entrants: ${assignError.message}`)
          }
        }
      }

      // Update league status to active
      const { error: updateError } = await supabase
        .from('leagues')
        .update({ status: 'active' })
        .eq('id', leagueId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error(`Failed to update league status: ${updateError.message}`)
      }

      // Redirect to league page
      router.push(`/leagues/${leagueId}`)
    } catch (err) {
      console.error('Random assignment error:', err)
      setError(err instanceof Error ? err.message : 'Failed to assign entrants')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white">League not found</p>
      </div>
    )
  }

  const totalPot = participants.reduce((sum, p) => sum + p.total_buy_in, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Setup: {league.name}</h1>
          <p className="text-gray-400">Add participants and assign wrestlers</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Buy-in per Entry</p>
            <p className="text-2xl font-bold text-white">${league.buy_in.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Participants</p>
            <p className="text-2xl font-bold text-white">{participants.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Entrants</p>
            <p className="text-2xl font-bold text-white">{totalEntrants} / {availableEntrants.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Prize Pool</p>
            <p className="text-2xl font-bold text-white">${totalPot.toFixed(2)}</p>
          </div>
        </div>

        {/* Add Participant Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add Participants</h2>
          <form onSubmit={handleAddParticipant} className="flex gap-4">
            <input
              type="text"
              required
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              placeholder="Participant name"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Participants List */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Participants ({participants.length})</h2>
            {participants.length > 0 && (
              <button
                onClick={handleDistributeEvenly}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Distribute Evenly ({evenDistribution} each)
              </button>
            )}
          </div>
          {participants.length > 0 ? (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex justify-between items-center bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{participant.name}</p>
                    <p className="text-gray-400 text-sm">Buy-in: ${participant.total_buy_in.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-gray-400 text-sm">Entrants:</label>
                      <input
                        type="number"
                        min="0"
                        max={remainingEntrants + participant.entrant_count}
                        value={participant.entrant_count}
                        onChange={(e) => handleUpdateEntrantCount(participant.id, parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteParticipant(participant.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No participants added yet</p>
          )}
          {participants.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                {remainingEntrants} of {availableEntrants.length} wrestlers available
              </p>
            </div>
          )}
        </div>

        {/* Random Assignment Button */}
        {participants.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={handleRandomAssignment}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Randomly Assign Wrestlers & Start League
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
