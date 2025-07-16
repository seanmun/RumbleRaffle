import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="text-6xl mb-6">🤼‍♂️</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Rumble <span className="text-yellow-400">Raffle</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Create wrestling raffle leagues with friends. Perfect for Royal Rumble watch parties, 
              wrestling events, and fantasy competitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create-league"
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
              >
                Create Your League &raquo;
              </Link>
             
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400">
              Get your wrestling raffle up and running in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create League</h3>
              <p className="text-slate-400">
                Set up your league with participants and entry counts. 
                Each person can buy multiple entries for better odds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share & Draw</h3>
              <p className="text-slate-400">
                Share the league URL with friends. When ready, draw entry numbers 
                randomly to assign participants to positions 1-30.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Track Live</h3>
              <p className="text-slate-400">
                Use the live tracker during events to assign wrestlers, 
                track eliminations, and celebrate the winner!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Perfect for Wrestling Fans
            </h2>
            <p className="text-xl text-slate-400">
              Everything you need to run exciting wrestling raffles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-4">🎲</div>
              <h3 className="text-xl font-semibold text-white mb-3">Fair Randomization</h3>
              <p className="text-slate-400">
                One-time number drawing ensures fair entry assignments that can&rsquo;t be gamed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-white mb-3">Mobile Friendly</h3>
              <p className="text-slate-400">
                Perfect for watching on phones during live events. Clean, responsive design.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold text-white mb-3">Easy Sharing</h3>
              <p className="text-slate-400">
                Share league URLs with friends. No accounts required - anyone can view and track.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Tracking</h3>
              <p className="text-slate-400">
                Real-time wrestler assignments and elimination tracking with undo functionality.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-3">Winner Detection</h3>
              <p className="text-slate-400">
                Automatic winner celebration when only one wrestler remains standing.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold text-white mb-3">Custom Wrestlers</h3>
              <p className="text-slate-400">
                Add surprise celebrity appearances or custom entries during live events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Wrestling Raffle?
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Create your first league and experience the excitement of wrestling raffles with friends.
          </p>
          <Link
            href="/create-league"
            className="bg-white hover:bg-yellow-50 text-yellow-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg inline-block"
          >
            Create League Now &raquo;
          </Link>
        </div>
      </section>
    </div>
  );
}