import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Badge from '@/components/Badge'
import ShareButton from '@/components/ShareButton'

export default async function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id: leagueId } = await params

  // Get user
  const { data: { user } } = await supabase.auth.getUser()

  // If user is not authenticated, redirect to login with league URL as redirect
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/leagues/${leagueId}`)}`)
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get league details
  const { data: league } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', leagueId)
    .single()

  if (!league) {
    redirect('/dashboard')
  }

  // Check if user is a member of this league
  const { data: membership } = await supabase
    .from('league_memberships')
    .select('*')
    .eq('league_id', leagueId)
    .eq('user_id', user.id)
    .single()

  // If not a member and not the creator, redirect to join page
  if (!membership && league.creator_id !== user.id) {
    redirect(`/leagues/${leagueId}/join`)
  }

  // Check if user has submitted their participants
  const { data: userParticipants } = await supabase
    .from('participants')
    .select('*')
    .eq('league_id', leagueId)
    .eq('user_id', user.id)

  // If member (or creator) but hasn't submitted participants yet, redirect to join page
  // This allows both creators and members to add their entries through the same flow
  if (membership && (!userParticipants || userParticipants.length === 0)) {
    redirect(`/leagues/${leagueId}/join`)
  }

  // If creator but not a member yet (shouldn't happen, but handle it)
  if (!membership && league.creator_id === user.id) {
    redirect(`/leagues/${leagueId}/join`)
  }

  // Get participants with their entrants
  const { data: participants } = await supabase
    .from('participants')
    .select(`
      *,
      league_entrant_assignments (
        *,
        global_entrants (
          entrant_number,
          wrestler_name,
          is_eliminated,
          final_placement
        )
      )
    `)
    .eq('league_id', leagueId)
    .order('total_score', { ascending: false })

  // Calculate scores based on placements
  const participantsWithScores = participants?.map(participant => {
    let score = 0
    const entrants = participant.league_entrant_assignments || []

    entrants.forEach(assignment => {
      const entrant = assignment.global_entrants
      if (entrant.final_placement) {
        // Scoring: 1st = 30pts, 2nd = 29pts, etc.
        score += (31 - entrant.final_placement)
      }
    })

    return {
      ...participant,
      calculated_score: score,
      entrants: entrants.map(a => a.global_entrants)
    }
  }).sort((a, b) => b.calculated_score - a.calculated_score)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header user={user || undefined} profile={profile || undefined} />
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{league.name}</h1>
              <p className="text-gray-400">
                {league.league_type === 'winner_takes_all' && 'Winner Takes All'}
                {league.league_type === 'points_based' && 'Points-Based Scoring'}
                {league.league_type === 'combined' && 'Combined Men\'s & Women\'s Events'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <ShareButton leagueId={leagueId} leagueName={league.name} />
              <Badge
                variant={
                  league.status === 'active' ? 'success' :
                  league.status === 'completed' ? 'neutral' :
                  'warning'
                }
                size="lg"
              >
                {league.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* League Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Buy-in</p>
            <p className="text-2xl font-bold text-white">${parseFloat(league.buy_in || '0').toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Prize Pool</p>
            <p className="text-2xl font-bold text-white">${parseFloat(league.total_prize_pool || '0').toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Participants</p>
            <p className="text-2xl font-bold text-white">{participants?.length || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Elimination Points</p>
            <p className="text-2xl font-bold text-white">
              {league.elimination_points_enabled ? `${league.points_per_elimination}pts` : 'Disabled'}
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Wrestlers
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {participantsWithScores?.map((participant, index) => (
                  <tr key={participant.id} className={index === 0 ? 'bg-yellow-500/10' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' :
                        'text-gray-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{participant.name}</p>
                      <p className="text-gray-400 text-sm">{participant.entrant_count} entrants</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {participant.entrants.map((entrant, i) => (
                          <Badge
                            key={i}
                            variant={
                              entrant.final_placement === 1 ? 'warning' :
                              entrant.final_placement && entrant.final_placement <= 3 ? 'info' :
                              entrant.is_eliminated ? 'danger' :
                              'neutral'
                            }
                            size="sm"
                          >
                            #{entrant.entrant_number} {entrant.wrestler_name}
                            {entrant.final_placement && ` (${entrant.final_placement}${
                              entrant.final_placement === 1 ? 'st' :
                              entrant.final_placement === 2 ? 'nd' :
                              entrant.final_placement === 3 ? 'rd' : 'th'
                            })`}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-2xl font-bold text-white">{participant.calculated_score}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-700">
            {participantsWithScores?.map((participant, index) => (
              <div
                key={participant.id}
                className={`p-4 ${index === 0 ? 'bg-yellow-500/10' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-gray-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-white font-medium text-lg">{participant.name}</p>
                      <p className="text-gray-400 text-sm">{participant.entrant_count} entrants</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{participant.calculated_score}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participant.entrants.map((entrant, i) => (
                    <Badge
                      key={i}
                      variant={
                        entrant.final_placement === 1 ? 'warning' :
                        entrant.final_placement && entrant.final_placement <= 3 ? 'info' :
                        entrant.is_eliminated ? 'danger' :
                        'neutral'
                      }
                      size="sm"
                    >
                      #{entrant.entrant_number} {entrant.wrestler_name}
                      {entrant.final_placement && ` (${entrant.final_placement}${
                        entrant.final_placement === 1 ? 'st' :
                        entrant.final_placement === 2 ? 'nd' :
                        entrant.final_placement === 3 ? 'rd' : 'th'
                      })`}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
