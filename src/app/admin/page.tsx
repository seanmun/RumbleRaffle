import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Header from '@/components/Header'

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Get user profile with admin status
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Redirect if not admin
  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  // Get all events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('year', { ascending: false })
    .order('event_type', { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header user={user} profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Wrestler Management */}
          <Link
            href="/admin/wrestlers"
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Wrestler Management</h3>
                <p className="text-gray-400 text-sm">Add & manage wrestlers</p>
              </div>
            </div>
            <p className="text-gray-300">Add new wrestlers to the database for both Men&apos;s and Women&apos;s events</p>
          </Link>

          {/* Live Event Control */}
          <Link
            href="/admin/live-event"
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Live Event Control</h3>
                <p className="text-gray-400 text-sm">Manage active rumbles</p>
              </div>
            </div>
            <p className="text-gray-300">Control live Royal Rumble events, track entrances and eliminations</p>
          </Link>

          {/* Event Management */}
          <Link
            href="/admin/events"
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Event Management</h3>
                <p className="text-gray-400 text-sm">Create & edit events</p>
              </div>
            </div>
            <p className="text-gray-300">Create new Royal Rumble events and manage existing ones</p>
          </Link>
        </div>

        {/* Events Overview */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Events Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events?.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                    event.status === 'live' ? 'bg-red-500/20 text-red-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">
                    Date: {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Type: {event.event_type === 'royal_rumble' ? "Men's Royal Rumble" : "Women's Royal Rumble"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
