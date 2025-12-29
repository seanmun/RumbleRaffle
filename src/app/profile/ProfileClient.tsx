'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Trophy, Bell } from 'lucide-react'

type ProfileClientProps = {
  user: {
    id: string
    email?: string
  }
  profile?: {
    name?: string
    email_rumble_reminders?: boolean
    email_league_results?: boolean
    email_announcements?: boolean
  }
  leaguesCount: number
}

export default function ProfileClient({ user, profile, leaguesCount }: ProfileClientProps) {
  const [name, setName] = useState(profile?.name || '')
  const [rumbleReminders, setRumbleReminders] = useState(profile?.email_rumble_reminders ?? true)
  const [leagueResults, setLeagueResults] = useState(profile?.email_league_results ?? true)
  const [announcements, setAnnouncements] = useState(profile?.email_announcements ?? true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    setSuccess(null)
    setError(null)

    const { error: updateError } = await supabase
      .from('users')
      .update({
        name,
        email_rumble_reminders: rumbleReminders,
        email_league_results: leagueResults,
        email_announcements: announcements,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account and email preferences</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Account Information */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">{user.email}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Active Leagues
            </label>
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">{leaguesCount}</span>
              <span className="text-gray-400">league{leaguesCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Email Preferences
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Royal Rumble Reminders */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="rumble-reminders"
              checked={rumbleReminders}
              onChange={(e) => setRumbleReminders(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
            />
            <div className="flex-1">
              <label htmlFor="rumble-reminders" className="block text-white font-medium mb-1 cursor-pointer">
                Royal Rumble Reminders
              </label>
              <p className="text-sm text-gray-400">
                Receive email reminders 7 days before, 1 day before, and on the day of the Royal Rumble event
              </p>
            </div>
          </div>

          {/* League Results */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="league-results"
              checked={leagueResults}
              onChange={(e) => setLeagueResults(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
            />
            <div className="flex-1">
              <label htmlFor="league-results" className="block text-white font-medium mb-1 cursor-pointer">
                League Results
              </label>
              <p className="text-sm text-gray-400">
                Get notified when your leagues are completed and final standings are available
              </p>
            </div>
          </div>

          {/* App Announcements */}
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="announcements"
              checked={announcements}
              onChange={(e) => setAnnouncements(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-800"
            />
            <div className="flex-1">
              <label htmlFor="announcements" className="block text-white font-medium mb-1 cursor-pointer">
                App Announcements
              </label>
              <p className="text-sm text-gray-400">
                Important updates and new features (maximum 2 emails per year)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
