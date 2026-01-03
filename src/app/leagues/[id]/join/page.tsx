'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { Plus, Trash2 } from 'lucide-react'

type League = {
  id: string
  name: string
  buy_in: number
  creator_id: string
  status: string
}

type ParticipantEntry = {
  name: string
  entrant_count: number
}

export default function JoinLeaguePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const leagueId = params.id as string

  const [league, setLeague] = useState<League | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isCreator, setIsCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Participant entries
  const [entries, setEntries] = useState<ParticipantEntry[]>([{ name: '', entrant_count: 1 }])

  useEffect(() => {
    loadData()
  }, [leagueId])

  async function loadData() {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (!currentUser) {
        router.push(`/login?redirect=${encodeURIComponent(`/leagues/${leagueId}/join`)}`)
        return
      }

      // Get user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      setProfile(userProfile)

      // Load league
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single()

      if (leagueError) throw leagueError
      setLeague(leagueData)

      // Check if user is the creator
      setIsCreator(leagueData.creator_id === currentUser.id)

      // Check if user already joined
      const { data: membership } = await supabase
        .from('league_memberships')
        .select('*')
        .eq('league_id', leagueId)
        .eq('user_id', currentUser.id)
        .single()

      // If already a member, check if they have participants
      if (membership) {
        const { data: existingParticipants } = await supabase
          .from('participants')
          .select('*')
          .eq('league_id', leagueId)
          .eq('user_id', currentUser.id)

        if (existingParticipants && existingParticipants.length > 0) {
          // Already submitted entries, redirect to league page
          router.push(`/leagues/${leagueId}`)
          return
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Load error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load league')
      setLoading(false)
    }
  }

  function addEntry() {
    setEntries([...entries, { name: '', entrant_count: 1 }])
  }

  function removeEntry(index: number) {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index))
    }
  }

  function updateEntry(index: number, field: 'name' | 'entrant_count', value: string | number) {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEntries(newEntries)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (!user || !league) {
        throw new Error('User or league not loaded')
      }

      // Validate entries
      const validEntries = entries.filter(e => e.name.trim() !== '' && e.entrant_count > 0)
      if (validEntries.length === 0) {
        throw new Error('Please add at least one participant')
      }

      // Check for duplicate names
      const names = validEntries.map(e => e.name.trim())
      const uniqueNames = new Set(names)
      if (names.length !== uniqueNames.size) {
        throw new Error('Participant names must be unique')
      }

      // Add user to league_memberships if not already there
      const { data: existingMembership, error: membershipCheckError } = await supabase
        .from('league_memberships')
        .select('*')
        .eq('league_id', leagueId)
        .eq('user_id', user.id)
        .maybeSingle()

      console.log('Membership check result:', { existingMembership, membershipCheckError })

      if (!existingMembership) {
        console.log('Creating membership for user:', user.id, 'league:', leagueId)
        const { data: membershipData, error: membershipError } = await supabase
          .from('league_memberships')
          .insert({
            league_id: leagueId,
            user_id: user.id,
            role: 'member',
            has_paid: league.buy_in === 0 // Auto-mark as paid if free
          })
          .select()

        if (membershipError) {
          console.error('Membership insert error:', membershipError)
          throw membershipError
        }
        console.log('Membership created:', membershipData)
      }

      // Create participants
      const participantsToInsert = validEntries.map(entry => ({
        league_id: leagueId,
        user_id: user.id,
        name: entry.name.trim(),
        entrant_count: entry.entrant_count,
        total_buy_in: league.buy_in * entry.entrant_count,
        total_score: 0
      }))

      console.log('Attempting to insert participants:', participantsToInsert)
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .insert(participantsToInsert)
        .select()

      if (participantsError) {
        console.error('Participants insert error:', participantsError)
        throw participantsError
      }
      console.log('Participants created:', participantsData)

      setSuccess(true)
      setTimeout(() => {
        router.push(`/leagues/${leagueId}`)
      }, 1500)
    } catch (err) {
      console.error('Submit error:', err)
      setError(err instanceof Error ? err.message : 'Failed to join league')
      setSubmitting(false)
    }
  }

  const totalEntries = entries.reduce((sum, e) => sum + (e.entrant_count || 0), 0)
  const totalCost = league ? totalEntries * league.buy_in : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header user={user} profile={profile} />
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            League not found
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header user={user} profile={profile} />
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isCreator ? 'Add Your Entries' : 'Join League'}
          </h1>
          <p className="text-gray-400">{league.name}</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            Successfully joined league! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-8 border border-gray-700 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isCreator ? 'Set Up Your Participants' : 'Add Your Entries'}
            </h2>
            <p className="text-gray-400 mb-6">
              {isCreator
                ? 'Add the participants you want to enter into the raffle. You can add yourself, friends, or family members.'
                : 'Enter the names and number of entries for each participant you want to add.'
              }
              {league.buy_in > 0 && ` Each entry costs $${league.buy_in.toFixed(2)}.`}
            </p>
          </div>

          {/* Participant Entries */}
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Participant Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={entry.name}
                        onChange={(e) => updateEntry(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Sean, Sean's Nephew"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Number of Entries
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required
                        value={entry.entrant_count}
                        onChange={(e) => updateEntry(index, 'entrant_count', parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      {league.buy_in > 0 && (
                        <p className="text-gray-400 text-sm mt-1">
                          Cost: ${(entry.entrant_count * league.buy_in).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="mt-8 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Entry Button */}
          <button
            type="button"
            onClick={addEntry}
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Participant
          </button>

          {/* Summary */}
          <div className="bg-purple-500/10 border border-purple-500 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Total Entries:</span>
              <span className="text-white font-bold text-lg">{totalEntries}</span>
            </div>
            {league.buy_in > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Cost:</span>
                <span className="text-white font-bold text-lg">${totalCost.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6">
            <Link
              href={`/leagues/${leagueId}`}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || success}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (isCreator ? 'Saving...' : 'Joining...') : success ? 'Success!' : (isCreator ? 'Save & Continue' : 'Join League')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
