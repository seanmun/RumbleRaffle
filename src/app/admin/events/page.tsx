'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Calendar, Trash2 } from 'lucide-react'

type Event = {
  id: string
  name: string
  description: string | null
  event_date: string
  event_type: 'royal_rumble' | 'womens_royal_rumble'
  year: number
  status: 'upcoming' | 'live' | 'completed'
  created_at: string
}

export default function EventManagementPage() {
  const router = useRouter()
  const supabase = createClient()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState<'royal_rumble' | 'womens_royal_rumble'>('royal_rumble')
  const [eventDate, setEventDate] = useState('')
  const [eventYear, setEventYear] = useState(new Date().getFullYear())
  const [eventDescription, setEventDescription] = useState('')
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'completed'>('completed')

  useEffect(() => {
    checkAuth()
    loadEvents()
  }, [])

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
        .order('event_date', { ascending: false })

      if (error) throw error

      setEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      if (!eventName.trim()) {
        setError('Please enter an event name')
        return
      }

      if (!eventDate) {
        setError('Please select an event date')
        return
      }

      const { error: insertError } = await supabase
        .from('events')
        .insert({
          name: eventName.trim(),
          description: eventDescription.trim() || null,
          event_date: eventDate,
          event_type: eventType,
          year: eventYear,
          status: eventStatus
        })

      if (insertError) throw insertError

      setSuccess(`Successfully created ${eventName}`)
      await loadEvents()

      // Clear form
      setEventName('')
      setEventDescription('')
      setEventDate('')
      setEventYear(new Date().getFullYear())
      setEventType('royal_rumble')
      setEventStatus('completed')
      setShowCreateForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
    }
  }

  async function handleDeleteEvent(eventId: string, eventName: string) {
    if (!confirm(`Are you sure you want to delete "${eventName}"? This cannot be undone.`)) return

    setError(null)
    setSuccess(null)

    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (deleteError) throw deleteError

      setSuccess(`Successfully deleted ${eventName}`)
      await loadEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
    }
  }

  // Helper to generate event name suggestions
  function generateEventName() {
    const type = eventType === 'royal_rumble' ? "Men's Royal Rumble" : "Women's Royal Rumble"
    return `${type} ${eventYear}`
  }

  // Auto-populate name when year or type changes
  useEffect(() => {
    if (showCreateForm && !eventName) {
      setEventName(generateEventName())
    }
  }, [eventType, eventYear, showCreateForm])

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading events...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">Event Management</h1>
          <p className="text-gray-400">Create and manage Royal Rumble events for testing and historical data</p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Create Event Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => {
                      setEventType(e.target.value as 'royal_rumble' | 'womens_royal_rumble')
                      setEventName(e.target.value === 'royal_rumble'
                        ? `Men's Royal Rumble ${eventYear}`
                        : `Women's Royal Rumble ${eventYear}`)
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="royal_rumble">Men's Royal Rumble</option>
                    <option value="womens_royal_rumble">Women's Royal Rumble</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    min="1988"
                    max="2030"
                    value={eventYear}
                    onChange={(e) => {
                      const year = parseInt(e.target.value)
                      setEventYear(year)
                      setEventName(eventType === 'royal_rumble'
                        ? `Men's Royal Rumble ${year}`
                        : `Women's Royal Rumble ${year}`)
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Men's Royal Rumble 2023"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Add notes about this event..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setEventStatus('completed')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      eventStatus === 'completed'
                        ? 'bg-gray-500/20 border-gray-500 text-gray-300'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium">Completed</div>
                    <div className="text-xs mt-1">Historical event for testing</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventStatus('upcoming')}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      eventStatus === 'upcoming'
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium">Upcoming</div>
                    <div className="text-xs mt-1">Future event</div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Events ({events.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-6 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{event.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                          event.status === 'live' ? 'bg-red-500/20 text-red-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {event.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.event_type === 'womens_royal_rumble'
                            ? 'bg-pink-500/20 text-pink-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {event.event_type === 'womens_royal_rumble' ? "Women's" : "Men's"}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div>Year: {event.year}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {event.status === 'completed' && (
                        <Link
                          href={`/admin/live-event?eventId=${event.id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          Practice Mode
                        </Link>
                      )}
                      <button
                        onClick={() => handleDeleteEvent(event.id, event.name)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-400">
                No events created yet. Create your first event to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
