import Link from "next/link";
import { createClient } from '@/lib/supabase/server'
import Header from "@/components/Header";
import { Dices, Smartphone, Link2, Zap, Trophy, Users } from "lucide-react";
import Logo from "@/components/Logo";

export default async function HomePage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile if authenticated
  const { data: profile } = user ? await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single() : { data: null }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rumbleraffle.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Rumble Raffle',
    applicationCategory: 'EntertainmentApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'Web',
    description: 'Create and manage wrestling-themed raffle leagues with friends. Perfect for Royal Rumble watch parties and wrestling events.',
    url: baseUrl,
    image: `${baseUrl}/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
    featureList: [
      'Fair random number drawing',
      'Live event tracking',
      'Mobile-friendly interface',
      'Real-time leaderboards',
      'Custom wrestler support',
      'Easy league sharing',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header user={user || undefined} profile={profile || undefined} />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%231a1a2e' width='1920' height='1080'/%3E%3C/svg%3E"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            aria-hidden="true"
          >
            <source src="/ring_prod.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-purple-900/50 to-gray-900/90"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Logo size="xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-bevan)] mb-6 tracking-wider" style={{
              WebkitTextStroke: '1px #ca8a04',
              WebkitTextFillColor: '#FFD700',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              Rumble Raffle
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create wrestling raffle leagues with friends. Perfect for Royal Rumble watch parties,
              wrestling events, and fantasy competitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50"
              >
                {user ? "Go to Dashboard" : "Get Started"} &raquo;
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get your wrestling raffle up and running in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg shadow-purple-500/50">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create League</h3>
              <p className="text-gray-400">
                Set up your league with participants and entry counts.
                Each person can buy multiple entries for better odds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg shadow-purple-500/50">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share & Draw</h3>
              <p className="text-gray-400">
                Share the league URL with friends. When ready, draw entry numbers
                randomly to assign participants to positions 1-30.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg shadow-purple-500/50">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Track Live</h3>
              <p className="text-gray-400">
                Use the live tracker during events to assign wrestlers,
                track eliminations, and celebrate the winner!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Perfect for Wrestling Fans
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to run exciting wrestling raffles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="mb-4">
                <Dices className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Fair Randomization</h3>
              <p className="text-gray-400">
                One-time number drawing ensures fair entry assignments that can&rsquo;t be gamed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="mb-4">
                <Smartphone className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Mobile Friendly</h3>
              <p className="text-gray-400">
                Perfect for watching on phones during live events. Clean, responsive design.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="mb-4">
                <Link2 className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Easy Sharing</h3>
              <p className="text-gray-400">
                Share league URLs with friends. No accounts required - anyone can view and track.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="mb-4">
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Tracking</h3>
              <p className="text-gray-400">
                Real-time wrestler assignments and elimination tracking with undo functionality.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="mb-4">
                <Trophy className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Winner Detection</h3>
              <p className="text-gray-400">
                Automatic winner celebration when only one wrestler remains standing.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="mb-4">
                <Users className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Custom Wrestlers</h3>
              <p className="text-gray-400">
                Add surprise celebrity appearances or custom entries during live events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Wrestling Raffle?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Create your first league and experience the excitement of wrestling raffles with friends.
          </p>
          <Link
            href={user ? "/leagues/create" : "/signup"}
            className="bg-white hover:bg-purple-50 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg inline-block"
          >
            {user ? "Create League Now" : "Get Started"} &raquo;
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}