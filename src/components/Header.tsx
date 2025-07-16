"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">🤼‍♂️</div>
            <span className="text-xl font-bold text-white">Rumble Raffle</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-yellow-400' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/create-league" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/create-league' 
                  ? 'text-yellow-400' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Create League
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link 
              href="/create-league"
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}