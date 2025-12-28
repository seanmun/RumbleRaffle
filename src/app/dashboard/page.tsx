import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import DashboardHeader from '@/components/DashboardHeader'

export default async function DashboardPage() {
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

  // Get user's leagues - simplified query
  const { data: leagues } = await supabase
    .from('leagues')
    .select('*')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  // Get available events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('year', { ascending: false })
    .order('event_type', { ascending: true })

  // Simplified leagues data for header
  const headerLeagues = leagues?.map(l => ({
    id: l.id,
    name: l.name,
    status: l.status
  })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <DashboardHeader
        user={user}
        profile={profile}
        leagues={headerLeagues}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Leagues</h1>
          <p className="text-gray-400 mt-1">Manage your Royal Rumble leagues</p>
        </div>

        {/* My Leagues Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Active Leagues</h2>
            <Link
              href="/leagues/create"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Create League
            </Link>
          </div>

          {leagues && leagues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leagues.map((league) => (
                <Link
                  key={league.id}
                  href={`/leagues/${league.id}`}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{league.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {league.league_type === 'combined' ? 'Combined Events' : 'Single Event'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 text-sm font-medium">
                      {league.creator_id === user.id ? 'League Manager' : 'Member'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      league.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      league.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {league.status}
                    </span>
                  </div>
                  {league.buy_in && parseFloat(league.buy_in) > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-400 text-sm">
                        Buy-in: <span className="text-white font-medium">${league.buy_in}</span>
                      </p>
                      <p className="text-gray-400 text-sm">
                        Prize Pool: <span className="text-white font-medium">${league.total_prize_pool}</span>
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
              <p className="text-gray-400 mb-4">You haven't joined any leagues yet</p>
              <Link
                href="/leagues/create"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Your First League
              </Link>
            </div>
          )}
        </section>

        {/* Available Events Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Available Events</h2>
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
                <p className="text-gray-500 text-sm">
                  {new Date(event.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
