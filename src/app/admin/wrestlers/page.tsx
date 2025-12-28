'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Wrestler = {
  id: string
  name: string
  gender: 'male' | 'female' | null
  is_active: boolean
  created_at: string
}

export default function WrestlerManagementPage() {
  const router = useRouter()
  const supabase = createClient()

  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  const [filteredWrestlers, setFilteredWrestlers] = useState<Wrestler[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add wrestler form
  const [newWrestlerName, setNewWrestlerName] = useState('')
  const [newWrestlerGender, setNewWrestlerGender] = useState<'male' | 'female'>('male')

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [newEntrantNumber, setNewEntrantNumber] = useState('')

  useEffect(() => {
    checkAuth()
    loadWrestlers()
  }, [])

  useEffect(() => {
    // Filter wrestlers based on search query and gender
    let filtered = wrestlers

    if (searchQuery) {
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter(w => w.gender === genderFilter)
    }

    setFilteredWrestlers(filtered)
  }, [searchQuery, genderFilter, wrestlers])

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

  async function loadWrestlers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('wrestler_pool')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setWrestlers(data || [])
      setFilteredWrestlers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wrestlers')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddWrestler(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      if (!newWrestlerName.trim()) {
        setError('Please enter a wrestler name')
        return
      }

      const { error: insertError } = await supabase
        .from('wrestler_pool')
        .insert({
          name: newWrestlerName.trim(),
          gender: newWrestlerGender,
          is_active: true
        })

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          setError('This wrestler already exists in the database')
        } else {
          throw insertError
        }
        return
      }

      // Reload wrestlers
      await loadWrestlers()

      // Clear form
      setNewWrestlerName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add wrestler')
    }
  }

  async function handleToggleActive(wrestlerId: string, currentStatus: boolean) {
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('wrestler_pool')
        .update({ is_active: !currentStatus })
        .eq('id', wrestlerId)

      if (updateError) throw updateError

      // Reload wrestlers
      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wrestler status')
    }
  }

  async function handleDeleteWrestler(wrestlerId: string) {
    if (!confirm('Are you sure you want to permanently delete this wrestler from the pool?')) return

    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('wrestler_pool')
        .delete()
        .eq('id', wrestlerId)

      if (deleteError) throw deleteError

      // Reload wrestlers
      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete wrestler')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Wrestler Management</h1>
          <p className="text-gray-400">Add and manage wrestlers for Royal Rumble events</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Event Selector */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
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

        {selectedEventId && (
          <>
            {/* Add Wrestler Form */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Add Wrestler to Event</h2>
              <form onSubmit={handleAddWrestler} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={newEntrantNumber}
                  onChange={(e) => setNewEntrantNumber(e.target.value)}
                  placeholder="Entrant #"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  required
                  value={newWrestlerName}
                  onChange={(e) => setNewWrestlerName(e.target.value)}
                  placeholder="Wrestler name"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Wrestler
                </button>
              </form>
            </div>

            {/* Wrestlers List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">
                  Wrestlers ({wrestlers.length}/30)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Entrant #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Wrestler Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {wrestlers.length > 0 ? (
                      wrestlers.map((wrestler) => (
                        <tr key={wrestler.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-bold text-white">#{wrestler.entrant_number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-white font-medium">{wrestler.wrestler_name}</p>
                          </td>
                          <td className="px-6 py-4">
                            {wrestler.final_placement ? (
                              <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                                Placed #{wrestler.final_placement}
                              </span>
                            ) : wrestler.is_eliminated ? (
                              <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                                Eliminated
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteWrestler(wrestler.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                          No wrestlers added yet for this event
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
