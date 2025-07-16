import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🤼‍♂️</div>
              <span className="text-xl font-bold text-white">Rumble Raffle</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Create and manage wrestling-themed raffle leagues with friends. 
              Perfect for Royal Rumble watch parties and wrestling events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create-league" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Create League
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/your-username/rumble-raffle" className="text-slate-400 hover:text-white text-sm transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://seanmun.com/" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Rumble Raffle. Built for wrestling fans, by wrestling fans.
          </p>
        </div>
      </div>
    </footer>
  );
}