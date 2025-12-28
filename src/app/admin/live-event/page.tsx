'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Event = {
  id: string
  name: string
  year: number
  event_type: string
  status: string
}

type Wrestler = {
  id: string
  entrant_number: number
  wrestler_name: string
  event_id: string
  is_eliminated: boolean
  eliminated_by?: string | null
  final_placement: number | null
  entry_time?: string | null
  elimination_time?: string | null
}

export default function LiveEventPage() {
  const router = useRouter()
  const supabase = createClient()

  const [events, setEvents] = useState<Event[]>([])
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Entrance tracking
  const [currentEntrantNumber, setCurrentEntrantNumber] = useState(1)

  useEffect(() => {
    checkAuth()
    loadEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      loadWrestlers()
    }
  }, [selectedEventId])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      router.push('/dashboard')
    }
  }

  async function loadEvents() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('year', { ascending: false })
        .order('event_type', { ascending: true })

      if (error) throw error

      setEvents(data || [])
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  async function loadWrestlers() {
    try {
      const { data, error } = await supabase
        .from('global_entrants')
        .select('*')
        .eq('event_id', selectedEventId)
        .order('entrant_number', { ascending: true })

      if (error) throw error

      setWrestlers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wrestlers')
    }
  }

  async function handleStartEvent() {
    if (!confirm('Start this event and mark it as LIVE?')) return

    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('events')
        .update({ status: 'live' })
        .eq('id', selectedEventId)

      if (updateError) throw updateError

      await loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start event')
    }
  }

  async function handleMarkEntrance(wrestlerId: string) {
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('global_entrants')
        .update({
          entry_time: new Date().toISOString()
        })
        .eq('id', wrestlerId)

      if (updateError) throw updateError

      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark entrance')
    }
  }

  async function handleMarkElimination(wrestlerId: string, eliminatedBy?: string) {
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('global_entrants')
        .update({
          is_eliminated: true,
          eliminated_by: eliminatedBy || null,
          elimination_time: new Date().toISOString()
        })
        .eq('id', wrestlerId)

      if (updateError) throw updateError

      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark elimination')
    }
  }

  async function handleUndoElimination(wrestlerId: string) {
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('global_entrants')
        .update({
          is_eliminated: false,
          eliminated_by: null,
          elimination_time: null,
          final_placement: null
        })
        .eq('id', wrestlerId)

      if (updateError) throw updateError

      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to undo elimination')
    }
  }

  async function handleSetPlacement(wrestlerId: string, placement: number) {
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('global_entrants')
        .update({
          final_placement: placement
        })
        .eq('id', wrestlerId)

      if (updateError) throw updateError

      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set placement')
    }
  }

  async function handleCompleteEvent() {
    if (!confirm('Mark this event as COMPLETED? This cannot be undone easily.')) return

    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('events')
        .update({ status: 'completed' })
        .eq('id', selectedEventId)

      if (updateError) throw updateError

      await loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete event')
    }
  }

  const selectedEvent = events.find(e => e.id === selectedEventId)
  const activeWrestlers = wrestlers.filter(w => !w.is_eliminated)
  const eliminatedWrestlers = wrestlers.filter(w => w.is_eliminated)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Live Event Control</h1>
          <p className="text-gray-400">Manage Royal Rumble entrances, eliminations, and placements in real-time</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Event Selector & Controls */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="event" className="block text-sm font-medium text-gray-300 mb-2">
                Select Event
              </label>
              <select
                id="event"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select an event...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.status})
                  </option>
                ))}
              </select>
            </div>
            {selectedEvent && (
              <div className="flex items-end gap-4">
                {selectedEvent.status === 'upcoming' && (
                  <button
                    onClick={handleStartEvent}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Start Event (Go LIVE)
                  </button>
                )}
                {selectedEvent.status === 'live' && (
                  <button
                    onClick={handleCompleteEvent}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Complete Event
                  </button>
                )}
              </div>
            )}
          </div>

          {selectedEvent && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Wrestlers</p>
                <p className="text-2xl font-bold text-white">{wrestlers.length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Still In Ring</p>
                <p className="text-2xl font-bold text-green-400">{activeWrestlers.length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Eliminated</p>
                <p className="text-2xl font-bold text-red-400">{eliminatedWrestlers.length}</p>
              </div>
            </div>
          )}
        </div>

        {selectedEventId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Wrestlers */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-green-600/20 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">
                  Active Wrestlers ({activeWrestlers.length})
                </h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {activeWrestlers.length > 0 ? (
                  <div className="divide-y divide-gray-700">
                    {activeWrestlers.map((wrestler) => (
                      <div key={wrestler.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-white">#{wrestler.entrant_number}</span>
                              <span className="text-white font-medium">{wrestler.wrestler_name}</span>
                            </div>
                            {wrestler.entry_time && (
                              <p className="text-gray-400 text-xs">
                                Entered: {new Date(wrestler.entry_time).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                          {!wrestler.entry_time && (
                            <button
                              onClick={() => handleMarkEntrance(wrestler.id)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Mark Entrance
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleMarkElimination(wrestler.id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                            className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            defaultValue=""
                          >
                            <option value="">Eliminate (select who eliminated)</option>
                            {activeWrestlers
                              .filter(w => w.id !== wrestler.id)
                              .map(w => (
                                <option key={w.id} value={w.id}>
                                  #{w.entrant_number} {w.wrestler_name}
                                </option>
                              ))}
                            <option value="self">Self-elimination</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No active wrestlers</p>
                )}
              </div>
            </div>

            {/* Eliminated Wrestlers */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-red-600/20 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">
                  Eliminated ({eliminatedWrestlers.length})
                </h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {eliminatedWrestlers.length > 0 ? (
                  <div className="divide-y divide-gray-700">
                    {eliminatedWrestlers
                      .sort((a, b) => {
                        // Sort by placement if available, otherwise by elimination time
                        if (a.final_placement && b.final_placement) {
                          return a.final_placement - b.final_placement
                        }
                        if (!a.elimination_time) return 1
                        if (!b.elimination_time) return -1
                        return new Date(b.elimination_time).getTime() - new Date(a.elimination_time).getTime()
                      })
                      .map((wrestler) => (
                        <div key={wrestler.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-bold text-white">#{wrestler.entrant_number}</span>
                                <span className="text-white font-medium">{wrestler.wrestler_name}</span>
                              </div>
                              {wrestler.elimination_time && (
                                <p className="text-gray-400 text-xs">
                                  Eliminated: {new Date(wrestler.elimination_time).toLocaleTimeString()}
                                </p>
                              )}
                              {wrestler.eliminated_by && (
                                <p className="text-gray-400 text-xs">
                                  By: {wrestlers.find(w => w.id === wrestler.eliminated_by)?.wrestler_name || 'Unknown'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              max="30"
                              value={wrestler.final_placement || ''}
                              onChange={(e) => {
                                const placement = parseInt(e.target.value)
                                if (placement) {
                                  handleSetPlacement(wrestler.id, placement)
                                }
                              }}
                              placeholder="Placement"
                              className="w-24 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <button
                              onClick={() => handleUndoElimination(wrestler.id)}
                              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Undo Elimination
                            </button>
                          </div>
                          {wrestler.final_placement && (
                            <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                              Placed #{wrestler.final_placement}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No eliminations yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
