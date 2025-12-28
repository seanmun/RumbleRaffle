'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Wrestler = {
  id: string
  name: string
  gender: 'male' | 'female' | null
  is_active: boolean
  created_at: string
}

export default function WrestlerManagementPage() {
  const router = useRouter()
  const supabase = createClient()

  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  const [filteredWrestlers, setFilteredWrestlers] = useState<Wrestler[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add wrestler form
  const [newWrestlerName, setNewWrestlerName] = useState('')
  const [newWrestlerGender, setNewWrestlerGender] = useState<'male' | 'female'>('male')

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all')
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    checkAuth()
    loadWrestlers()
  }, [])

  useEffect(() => {
    // Filter wrestlers based on search query, gender, and active status
    let filtered = wrestlers

    if (searchQuery) {
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (genderFilter !== 'all') {
      filtered = filtered.filter(w => w.gender === genderFilter)
    }

    if (activeFilter === 'active') {
      filtered = filtered.filter(w => w.is_active)
    } else if (activeFilter === 'inactive') {
      filtered = filtered.filter(w => !w.is_active)
    }

    setFilteredWrestlers(filtered)
  }, [searchQuery, genderFilter, activeFilter, wrestlers])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      router.push('/dashboard')
    }
  }

  async function loadWrestlers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('wrestler_pool')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setWrestlers(data || [])
      setFilteredWrestlers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wrestlers')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddWrestler(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      if (!newWrestlerName.trim()) {
        setError('Please enter a wrestler name')
        return
      }

      const { error: insertError } = await supabase
        .from('wrestler_pool')
        .insert({
          name: newWrestlerName.trim(),
          gender: newWrestlerGender,
          is_active: true
        })

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This wrestler already exists in the database')
        } else {
          throw insertError
        }
        return
      }

      await loadWrestlers()
      setNewWrestlerName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add wrestler')
    }
  }

  async function handleToggleActive(wrestlerId: string, currentStatus: boolean) {
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('wrestler_pool')
        .update({ is_active: !currentStatus })
        .eq('id', wrestlerId)

      if (updateError) throw updateError

      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wrestler status')
    }
  }

  async function handleDeleteWrestler(wrestlerId: string) {
    if (!confirm('Are you sure you want to permanently delete this wrestler from the pool?')) return

    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('wrestler_pool')
        .delete()
        .eq('id', wrestlerId)

      if (deleteError) throw deleteError

      await loadWrestlers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete wrestler')
    }
  }

  const maleCount = wrestlers.filter(w => w.gender === 'male' && w.is_active).length
  const femaleCount = wrestlers.filter(w => w.gender === 'female' && w.is_active).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Wrestler Pool</h1>
          <p className="text-gray-400">Manage the global database of wrestlers</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Wrestlers</p>
            <p className="text-2xl font-bold text-white">{wrestlers.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Active Men</p>
            <p className="text-2xl font-bold text-blue-400">{maleCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Active Women</p>
            <p className="text-2xl font-bold text-pink-400">{femaleCount}</p>
          </div>
        </div>

        {/* Add Wrestler Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add Wrestler to Pool</h2>
          <form onSubmit={handleAddWrestler} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              required
              value={newWrestlerName}
              onChange={(e) => setNewWrestlerName(e.target.value)}
              placeholder="Wrestler name"
              className="md:col-span-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={newWrestlerGender}
              onChange={(e) => setNewWrestlerGender(e.target.value as 'male' | 'female')}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Wrestler
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Wrestlers List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Wrestlers ({filteredWrestlers.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredWrestlers.length > 0 ? (
                  filteredWrestlers.map((wrestler) => (
                    <tr key={wrestler.id}>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{wrestler.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          wrestler.gender === 'male'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-pink-500/20 text-pink-400'
                        }`}>
                          {wrestler.gender === 'male' ? 'Male' : 'Female'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          wrestler.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {wrestler.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(wrestler.id, wrestler.is_active)}
                            className={`px-3 py-1 ${
                              wrestler.is_active
                                ? 'bg-gray-600 hover:bg-gray-500'
                                : 'bg-green-600 hover:bg-green-700'
                            } text-white text-sm rounded-lg font-medium transition-colors`}
                          >
                            {wrestler.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteWrestler(wrestler.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      No wrestlers found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
