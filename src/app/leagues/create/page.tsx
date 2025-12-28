'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'

type Event = {
  id: string
  name: string
  year: number
  event_type: string
  status: string
  event_date: string
}

export default function CreateLeaguePage() {
  const router = useRouter()
  const supabase = createClient()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [leagueName, setLeagueName] = useState('')
  const [leagueType, setLeagueType] = useState<'winner_takes_all' | 'points_based' | 'combined'>('winner_takes_all')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedSecondaryEventId, setSelectedSecondaryEventId] = useState('')
  const [buyIn, setBuyIn] = useState('0')
  const [isPublic, setIsPublic] = useState(false)
  const [eliminationPointsEnabled, setEliminationPointsEnabled] = useState(false)
  const [pointsPerElimination, setPointsPerElimination] = useState('5')
  const [timeBonusEnabled, setTimeBonusEnabled] = useState(false)

  // Load events on mount
  useEffect(() => {
    async function loadEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('year', { ascending: false })
        .order('event_type', { ascending: true })

      if (data) {
        setEvents(data)
      }
    }
    loadEvents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to create a league')
        setLoading(false)
        return
      }

      // Create league
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          name: leagueName,
          league_type: leagueType,
          event_id: selectedEventId,
          secondary_event_id: leagueType === 'combined' ? selectedSecondaryEventId : null,
          creator_id: user.id,
          buy_in: parseFloat(buyIn),
          total_prize_pool: 0,
          is_public: isPublic,
          elimination_points_enabled: leagueType !== 'winner_takes_all' && eliminationPointsEnabled,
          points_per_elimination: parseInt(pointsPerElimination),
          placement_points_enabled: leagueType !== 'winner_takes_all',
          time_bonus_enabled: timeBonusEnabled,
          status: 'setup'
        })
        .select()
        .single()

      if (leagueError) {
        setError(leagueError.message)
        setLoading(false)
        return
      }

      // Add creator as league manager
      await supabase
        .from('league_memberships')
        .insert({
          league_id: league.id,
          user_id: user.id,
          role: 'manager'
        })

      // Redirect to league setup page
      router.push(`/leagues/${league.id}/setup`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create league')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create a League</h1>
          <p className="text-gray-400">Set up your Royal Rumble raffle league</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 border border-gray-700 space-y-6">
          {/* League Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              League Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="My Awesome League"
            />
          </div>

          {/* League Type */}
          <div>
            <label htmlFor="leagueType" className="block text-sm font-medium text-gray-300 mb-2">
              League Type *
            </label>
            <select
              id="leagueType"
              required
              value={leagueType}
              onChange={(e) => setLeagueType(e.target.value as 'winner_takes_all' | 'points_based' | 'combined')}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="winner_takes_all">Winner Takes All - Simple (whoever has the winner wins)</option>
              <option value="points_based">Points-Based - Placement + Eliminations</option>
              <option value="combined">Combined Men&apos;s + Women&apos;s - Points from both events</option>
            </select>
            <p className="text-gray-400 text-sm mt-2">
              {leagueType === 'winner_takes_all' && 'Simple mode: The participant with the Royal Rumble winner takes the prize pool.'}
              {leagueType === 'points_based' && 'Points awarded for placement (1st = 30pts, 2nd = 29pts...) + optional elimination bonuses.'}
              {leagueType === 'combined' && 'Select both Men&apos;s and Women&apos;s events. Total points from both events combined.'}
            </p>
          </div>

          {/* Event Selection */}
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-300 mb-2">
              {leagueType === 'combined' ? 'Primary Event (Men\'s) *' : 'Event *'}
            </label>
            <select
              id="event"
              required
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select an event...</option>
              {events.filter(e => leagueType === 'combined' ? e.event_type === 'royal_rumble' : true).map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.status})
                </option>
              ))}
            </select>
          </div>

          {/* Secondary Event (Combined only) */}
          {leagueType === 'combined' && (
            <div>
              <label htmlFor="secondaryEvent" className="block text-sm font-medium text-gray-300 mb-2">
                Secondary Event (Women&apos;s) *
              </label>
              <select
                id="secondaryEvent"
                required
                value={selectedSecondaryEventId}
                onChange={(e) => setSelectedSecondaryEventId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select an event...</option>
                {events.filter(e => e.event_type === 'royal_rumble_women').map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Buy-in */}
          <div>
            <label htmlFor="buyIn" className="block text-sm font-medium text-gray-300 mb-2">
              Buy-in Amount ($)
            </label>
            <input
              id="buyIn"
              type="number"
              min="0"
              step="0.01"
              value={buyIn}
              onChange={(e) => setBuyIn(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
            />
            <p className="text-gray-400 text-sm mt-1">Leave at 0 for a free league</p>
          </div>

          {/* Public/Private */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-300">
                Make this league public (anyone can find and join)
              </span>
            </label>
          </div>

          {/* Points Options (Points-based and Combined only) */}
          {leagueType !== 'winner_takes_all' && (
            <div className="border-t border-gray-700 pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Scoring Options</h3>

              {/* Elimination Points */}
              <div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={eliminationPointsEnabled}
                    onChange={(e) => setEliminationPointsEnabled(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Enable elimination bonus points
                  </span>
                </label>

                {eliminationPointsEnabled && (
                  <div>
                    <label htmlFor="pointsPerElimination" className="block text-sm font-medium text-gray-300 mb-2">
                      Points per Elimination
                    </label>
                    <input
                      id="pointsPerElimination"
                      type="number"
                      min="1"
                      value={pointsPerElimination}
                      onChange={(e) => setPointsPerElimination(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                      Bonus points awarded when your wrestler eliminates someone
                    </p>
                  </div>
                )}
              </div>

              {/* Time Bonus */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={timeBonusEnabled}
                    onChange={(e) => setTimeBonusEnabled(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Enable time-lasted bonus (small weight)
                  </span>
                </label>
                <p className="text-gray-400 text-xs mt-1 ml-6">
                  Adds small bonus points based on how long wrestlers lasted in the match
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create League'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
