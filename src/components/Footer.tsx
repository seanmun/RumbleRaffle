import Link from "next/link";
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Logo size="sm" />
              <span className="text-xl font-[family-name:var(--font-bevan)] text-white">Rumble Raffle</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Create and manage wrestling-themed raffle leagues with friends.
              Perfect for Royal Rumble watch parties and wrestling events.
            </p>
          </div>

          {/* Quick Links & Support - 2 columns on mobile, part of 4 column grid on desktop */}
          <div className="col-span-1 grid grid-cols-2 gap-8 md:contents">
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white text-sm transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-slate-400 hover:text-white text-sm transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">
                    Dashboard
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
                  <Link href="/media" className="text-slate-400 hover:text-white text-sm transition-colors">
                    Media & Brand
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Rumble Raffle. Built for wrestling fans, by wrestling fans.
          </p>
        </div>
      </div>
    </footer>
  );
}