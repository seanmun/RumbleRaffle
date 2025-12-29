"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Home, Trophy, Settings, Menu, X, ChevronDown, LayoutDashboard, Plus, User, LogOut } from "lucide-react";

type HeaderProps = {
  user?: {
    id: string
    email?: string
  }
  profile?: {
    name?: string
    is_admin?: boolean
  }
  leagues?: Array<{
    id: string
    name: string
    status: string
  }>
  onLogout?: () => void
}

export default function Header({ user, profile, leagues, onLogout }: HeaderProps = {}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [leaguesExpanded, setLeaguesExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path)
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedOutsideDesktop = desktopDropdownRef.current && !desktopDropdownRef.current.contains(target);
      const clickedOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(target);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setIsProfileDropdownOpen(false);
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  return (
    <>
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🤼‍♂️</div>
              <span className="text-xl font-[family-name:var(--font-bevan)] text-white">
                <span className="hidden md:inline">Rumble Raffle</span>
                <span className="md:hidden">RR</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') && pathname === '/'
                    ? 'text-purple-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </Link>

              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/dashboard') || isActive('/leagues')
                        ? 'text-purple-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    My Leagues
                  </Link>

                  {profile?.is_admin && (
                    <Link
                      href="/admin"
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin')
                          ? 'text-red-400'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Right side actions - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={desktopDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400" />
                      {!profile?.name && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-800"></span>
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">
                      {profile?.name || user.email}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white truncate">
                          {profile?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      {onLogout && (
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile - User indicator or auth buttons */}
            <div className="md:hidden relative" ref={mobileDropdownRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-1 text-purple-400 text-sm"
                  >
                    <div className="relative">
                      <User className="w-4 h-4" />
                      {!profile?.name && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-800"></span>
                      )}
                    </div>
                    <span>{profile?.name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white truncate">
                          {profile?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      {onLogout && (
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-purple-400 text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🤼‍♂️</div>
              <span className="text-lg font-bold text-white">Menu</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {user && (
              <>
                {/* My Leagues with Dropdown */}
                <div>
                  <button
                    onClick={() => setLeaguesExpanded(!leaguesExpanded)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard') || isActive('/leagues')
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-5 h-5" />
                    <span className="flex-1 text-left">My Leagues</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${leaguesExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {leaguesExpanded && (
                    <div className="mt-1 ml-4 space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/leagues/create"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create League</span>
                      </Link>
                      {leagues && leagues.length > 0 && (
                        <>
                          <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                            Your Leagues
                          </div>
                          {leagues.map((league) => (
                            <Link
                              key={league.id}
                              href={`/leagues/${league.id}`}
                              onClick={closeMobileMenu}
                              className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">{league.name}</span>
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                                  league.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                  league.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {league.status}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {profile?.is_admin && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            {user ? (
              <div className="space-y-3">
                <div className="text-gray-400 text-sm px-4 truncate">
                  {profile?.name || user.email}
                </div>
                {onLogout && (
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      onLogout();
                    }}
                    className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-lg font-medium transition-colors text-sm"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-lg font-medium transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-center rounded-lg font-medium transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}