import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'

export default async function LeaguePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id: leagueId } = await params

  // Get user
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id || '')
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{league.name}</h1>
              <p className="text-gray-400">
                {league.league_type === 'winner_takes_all' && 'Winner Takes All'}
                {league.league_type === 'points_based' && 'Points-Based Scoring'}
                {league.league_type === 'combined' && 'Combined Men\'s & Women\'s Events'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
              league.status === 'active' ? 'bg-green-500/20 text-green-400' :
              league.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {league.status}
            </span>
          </div>
        </div>

        {/* League Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
          <div className="overflow-x-auto">
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
                          <span
                            key={i}
                            className={`px-2 py-1 rounded text-xs ${
                              entrant.final_placement === 1 ? 'bg-yellow-500/20 text-yellow-400 font-bold' :
                              entrant.final_placement && entrant.final_placement <= 3 ? 'bg-purple-500/20 text-purple-400' :
                              entrant.is_eliminated ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-700 text-gray-300'
                            }`}
                          >
                            #{entrant.entrant_number} {entrant.wrestler_name}
                            {entrant.final_placement && ` (${entrant.final_placement}${
                              entrant.final_placement === 1 ? 'st' :
                              entrant.final_placement === 2 ? 'nd' :
                              entrant.final_placement === 3 ? 'rd' : 'th'
                            })`}
                          </span>
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
        </div>
      </div>
    </div>
  )
}
