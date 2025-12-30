import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import Header from "@/components/Header"
import { Users, Shuffle, Trophy, Zap, Calendar, BarChart3, ClipboardList, UserPlus, Ticket, TrendingUp, Medal, Sparkles, Smartphone, Lock } from "lucide-react"
import Logo from "@/components/Logo"

export const metadata = {
  title: "How It Works",
  description: "Learn how to create and manage wrestling raffle leagues with Rumble Raffle. Step-by-step guide for Royal Rumble watch parties - create leagues, invite friends, draw numbers, track live events, and celebrate winners.",
  keywords: ["how to create wrestling raffle", "royal rumble raffle guide", "wrestling league tutorial", "rumble raffle instructions", "wrestling pool setup"],
  openGraph: {
    title: "How Rumble Raffle Works - Complete Guide",
    description: "Step-by-step guide to creating wrestling raffle leagues for Royal Rumble watch parties",
    type: "article",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rumbleraffle.com'}/about`,
  },
}

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single() : { data: null }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header user={user || undefined} profile={profile || undefined} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo size="xl" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Rumble Raffle Works
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create exciting wrestling raffle leagues for Royal Rumble events.
            Perfect for watch parties, office pools, or friendly competitions.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-20 mb-20">
          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                  <span className="text-gray-900 font-bold text-xl">1</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Create Your League</h2>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                Start by creating a new league for an upcoming Royal Rumble event.
                Give it a name, choose between Men's or Women's Rumble (or both!),
                and set optional buy-in amounts for prize pools.
              </p>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  League Options
                </h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Choose Men's or Women's Royal Rumble</li>
                  <li>• Set buy-in amount (optional)</li>
                  <li>• Select scoring method (points or winner-takes-all)</li>
                  <li>• Invite participants via shareable link</li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              {/* Image Placeholder */}
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <ClipboardList className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-gray-500 font-medium">Screenshot: Create League Form</p>
                  <p className="text-gray-600 text-sm">League name, event selection, settings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <UserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-500 font-medium">Screenshot: Invite Participants</p>
                <p className="text-gray-600 text-sm">Share link, participant list, confirmations</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                  <span className="text-gray-900 font-bold text-xl">2</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Invite Participants</h2>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                Share your league's unique invite link with friends. Participants join,
                create their accounts, and confirm their entry. The league commissioner
                can see who's joined in real-time.
              </p>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Participant Management
                </h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Share invite link via text, email, or social</li>
                  <li>• Participants create free accounts</li>
                  <li>• Track confirmations in real-time</li>
                  <li>• Set participant limits (typically 30 max)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                  <span className="text-gray-900 font-bold text-xl">3</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Draw Entry Numbers</h2>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                Once everyone's confirmed, it's time for the exciting part - the draw!
                Entry numbers (1-30) are randomly assigned to participants. Each number
                corresponds to a wrestler's entrance position in the Royal Rumble.
              </p>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Shuffle className="w-5 h-5 text-purple-400" />
                  Random Assignment
                </h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Completely random and fair distribution</li>
                  <li>• Each participant gets their entry number(s)</li>
                  <li>• Can't change after draw (keeps it fair!)</li>
                  <li>• Multiple entries per person supported</li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-gray-500 font-medium">Screenshot: Draw Interface</p>
                  <p className="text-gray-600 text-sm">Random number assignment, participant list</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl aspect-video flex items-center justify-center">
              <div className="text-center p-8">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-gray-500 font-medium">Screenshot: Live Event Tracking</p>
                <p className="text-gray-600 text-sm">Real-time leaderboard, wrestler assignments</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                  <span className="text-gray-900 font-bold text-xl">4</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Watch & Track Live</h2>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                During the Royal Rumble event, watch the excitement unfold as wrestlers
                enter at their assigned numbers. Track eliminations, scores, and see who's
                leading in real-time on the live leaderboard.
              </p>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Live Features
                </h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Real-time leaderboard updates</li>
                  <li>• See which wrestlers are still in</li>
                  <li>• Track eliminations as they happen</li>
                  <li>• Automatic scoring calculations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                  <span className="text-gray-900 font-bold text-xl">5</span>
                </div>
                <h2 className="text-3xl font-bold text-white">Celebrate the Winner</h2>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                After the event concludes, final standings are automatically calculated.
                See detailed stats, celebrate the winner, and review everyone's performance.
                Perfect for settling bragging rights!
              </p>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Final Results
                </h3>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• Final leaderboard with complete rankings</li>
                  <li>• Detailed breakdown of each participant's wrestlers</li>
                  <li>• Historical record of all league events</li>
                  <li>• Share results with participants</li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <Medal className="w-16 h-16 text-gray-600 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-gray-500 font-medium">Screenshot: Final Leaderboard</p>
                  <p className="text-gray-600 text-sm">Rankings, scores, winner highlight</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Methods */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Scoring Methods</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Points-Based */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Points-Based
              </h3>
              <p className="text-gray-400 mb-4">
                Earn points based on how long your wrestler lasts in the Rumble.
                Highest total score wins!
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Winner (1st place)
                  </span>
                  <span className="font-bold text-yellow-500">30 points</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-gray-400" />
                    Runner-up (2nd place)
                  </span>
                  <span className="font-bold text-gray-400">29 points</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-orange-400" />
                    3rd place
                  </span>
                  <span className="font-bold text-orange-400">28 points</span>
                </div>
                <div className="text-gray-500 text-xs pt-2 border-t border-gray-700">
                  Points decrease by placement (30, 29, 28... down to 1)
                </div>
              </div>
            </div>

            {/* Winner Takes All */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-500" />
                Winner Takes All
              </h3>
              <p className="text-gray-400 mb-4">
                Simple and exciting - whoever has the Royal Rumble winner takes home
                the entire prize pool!
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-500" />
                    Royal Rumble Winner
                  </span>
                  <span className="font-bold text-purple-500">100% of pot</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Everyone else</span>
                  <span>$0</span>
                </div>
                <div className="text-gray-500 text-xs pt-2 border-t border-gray-700">
                  High risk, high reward! Perfect for smaller groups.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Choose Rumble Raffle?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <Sparkles className="w-12 h-12 text-yellow-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold mb-2">Lightning Fast</h3>
              <p className="text-purple-100 text-sm">
                Create a league in under 2 minutes. No complicated setup required.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <Smartphone className="w-12 h-12 text-purple-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold mb-2">Mobile Friendly</h3>
              <p className="text-purple-100 text-sm">
                Track your league from anywhere. Perfect for watch parties.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <Lock className="w-12 h-12 text-green-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-bold mb-2">Secure & Fair</h3>
              <p className="text-purple-100 text-sm">
                Provably random draws. Your data is safe and secure.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your League?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of wrestling fans making Royal Rumble events more exciting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50"
            >
              {user ? "Go to Dashboard" : "Create Free Account"} →
            </Link>
            <Link
              href="/"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors border border-gray-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
