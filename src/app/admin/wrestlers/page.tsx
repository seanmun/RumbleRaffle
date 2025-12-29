'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Upload, Plus, Search, Filter, Edit2, X } from 'lucide-react'

type Wrestler = {
  id: string
  name: string
  gender: 'male' | 'female' | null
  image_url: string | null
  is_active: boolean
  created_at: string
}

// Simple fuzzy matching using Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

function findSimilarWrestlers(name: string, existingWrestlers: Wrestler[]): Wrestler[] {
  const normalizedName = name.toLowerCase().trim()
  const threshold = 3 // Maximum edit distance for similarity

  return existingWrestlers.filter(wrestler => {
    const distance = levenshteinDistance(normalizedName, wrestler.name.toLowerCase())
    return distance <= threshold && distance > 0 // Exclude exact matches (distance 0)
  })
}

export default function WrestlerManagementPage() {
  const router = useRouter()
  const supabase = createClient()

  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  const [filteredWrestlers, setFilteredWrestlers] = useState<Wrestler[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Add wrestler form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWrestlerName, setNewWrestlerName] = useState('')
  const [newWrestlerGender, setNewWrestlerGender] = useState<'male' | 'female'>('male')
  const [newWrestlerImageUrl, setNewWrestlerImageUrl] = useState('')
  const [similarWrestlers, setSimilarWrestlers] = useState<Wrestler[]>([])

  // CSV upload
  const [showCsvUpload, setShowCsvUpload] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<Array<{ name: string; gender: string; image_url?: string }>>([])

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingWrestler, setEditingWrestler] = useState<Wrestler | null>(null)
  const [editName, setEditName] = useState('')
  const [editGender, setEditGender] = useState<'male' | 'female'>('male')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)

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

    if (activeFilter !== 'all') {
      filtered = filtered.filter(w =>
        activeFilter === 'active' ? w.is_active : !w.is_active
      )
    }

    setFilteredWrestlers(filtered)
  }, [searchQuery, genderFilter, activeFilter, wrestlers])

  useEffect(() => {
    // Check for similar wrestlers when name changes
    if (newWrestlerName.trim().length > 2) {
      const similar = findSimilarWrestlers(newWrestlerName, wrestlers)
      setSimilarWrestlers(similar)
    } else {
      setSimilarWrestlers([])
    }
  }, [newWrestlerName, wrestlers])

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
    setSuccess(null)

    try {
      if (!newWrestlerName.trim()) {
        setError('Please enter a wrestler name')
        return
      }

      // Check for exact match
      const exactMatch = wrestlers.find(
        w => w.name.toLowerCase() === newWrestlerName.trim().toLowerCase()
      )

      if (exactMatch) {
        setError('This wrestler already exists in the database')
        return
      }

      const { error: insertError } = await supabase
        .from('wrestler_pool')
        .insert({
          name: newWrestlerName.trim(),
          gender: newWrestlerGender,
          image_url: newWrestlerImageUrl.trim() || null,
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

      setSuccess(`Successfully added ${newWrestlerName}`)
      await loadWrestlers()

      // Clear form
      setNewWrestlerName('')
      setNewWrestlerImageUrl('')
      setSimilarWrestlers([])
      setShowAddForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add wrestler')
    }
  }

  function openEditModal(wrestler: Wrestler) {
    setEditingWrestler(wrestler)
    setEditName(wrestler.name)
    setEditGender(wrestler.gender || 'male')
    setEditImageUrl(wrestler.image_url || '')
    setEditIsActive(wrestler.is_active)
    setShowEditModal(true)
  }

  function closeEditModal() {
    setShowEditModal(false)
    setEditingWrestler(null)
    setEditName('')
    setEditGender('male')
    setEditImageUrl('')
    setEditIsActive(true)
  }

  async function handleUpdateWrestler(e: React.FormEvent) {
    e.preventDefault()
    if (!editingWrestler) return

    setError(null)
    setSuccess(null)

    try {
      if (!editName.trim()) {
        setError('Please enter a wrestler name')
        return
      }

      const { error: updateError } = await supabase
        .from('wrestler_pool')
        .update({
          name: editName.trim(),
          gender: editGender,
          image_url: editImageUrl.trim() || null,
          is_active: editIsActive
        })
        .eq('id', editingWrestler.id)

      if (updateError) {
        if (updateError.code === '23505') {
          setError('A wrestler with this name already exists')
        } else {
          throw updateError
        }
        return
      }

      setSuccess(`Successfully updated ${editName}`)
      await loadWrestlers()
      closeEditModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wrestler')
    }
  }

  function handleCsvFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    const reader = new FileReader()

    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())

      // Parse CSV (expecting: name,gender,image_url)
      const parsed = lines.slice(1).map(line => {
        const [name, gender, image_url] = line.split(',').map(s => s.trim())
        return { name, gender, image_url }
      })

      setCsvPreview(parsed)
    }

    reader.readAsText(file)
  }

  async function handleCsvUpload() {
    if (!csvPreview.length) {
      setError('No valid wrestlers found in CSV')
      return
    }

    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      let addedCount = 0
      let skippedCount = 0

      for (const wrestler of csvPreview) {
        // Check for duplicates
        const exists = wrestlers.find(
          w => w.name.toLowerCase() === wrestler.name.toLowerCase()
        )

        if (exists) {
          skippedCount++
          continue
        }

        const { error: insertError } = await supabase
          .from('wrestler_pool')
          .insert({
            name: wrestler.name,
            gender: wrestler.gender === 'female' ? 'female' : 'male',
            image_url: wrestler.image_url || null,
            is_active: true
          })

        if (insertError) {
          console.error(`Failed to add ${wrestler.name}:`, insertError)
          skippedCount++
        } else {
          addedCount++
        }
      }

      setSuccess(`Successfully added ${addedCount} wrestlers. Skipped ${skippedCount} duplicates.`)
      await loadWrestlers()

      // Clear CSV form
      setCsvFile(null)
      setCsvPreview([])
      setShowCsvUpload(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CSV')
    } finally {
      setLoading(false)
    }
  }

  if (loading && wrestlers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading wrestlers...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
          >
            ← Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Wrestler Pool Management</h1>
          <p className="text-gray-400">Manage global wrestler database for Royal Rumble events</p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm)
              setShowCsvUpload(false)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Wrestler
          </button>
          <button
            onClick={() => {
              setShowCsvUpload(!showCsvUpload)
              setShowAddForm(false)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload CSV
          </button>
        </div>

        {/* Add Wrestler Form */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Add New Wrestler</h2>
            <form onSubmit={handleAddWrestler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wrestler Name *
                </label>
                <input
                  type="text"
                  required
                  value={newWrestlerName}
                  onChange={(e) => setNewWrestlerName(e.target.value)}
                  placeholder="e.g., John Cena"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {similarWrestlers.length > 0 && (
                  <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                    <p className="text-yellow-400 text-sm font-medium mb-1">
                      ⚠️ Similar wrestlers found:
                    </p>
                    <ul className="text-yellow-300 text-sm">
                      {similarWrestlers.map(w => (
                        <li key={w.id}>• {w.name} ({w.gender})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={newWrestlerGender}
                    onChange={(e) => setNewWrestlerGender(e.target.value as 'male' | 'female')}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newWrestlerImageUrl}
                    onChange={(e) => setNewWrestlerImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Wrestler
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CSV Upload Form */}
        {showCsvUpload && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Upload Wrestlers via CSV</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CSV File
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  Format: name,gender,image_url (header row required)
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
              </div>

              {csvPreview.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-2">
                    Preview ({csvPreview.length} wrestlers):
                  </p>
                  <div className="max-h-60 overflow-y-auto bg-gray-700/50 rounded-lg p-4">
                    <ul className="text-sm text-gray-300 space-y-1">
                      {csvPreview.slice(0, 10).map((w, i) => (
                        <li key={i}>• {w.name} ({w.gender})</li>
                      ))}
                      {csvPreview.length > 10 && (
                        <li className="text-gray-500">... and {csvPreview.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleCsvUpload}
                  disabled={!csvPreview.length || loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload Wrestlers'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCsvUpload(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wrestlers..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Gender
              </label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as any)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Wrestlers List */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              Wrestlers ({filteredWrestlers.length} of {wrestlers.length})
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
                    <tr key={wrestler.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {wrestler.image_url ? (
                            <img
                              src={wrestler.image_url}
                              alt={wrestler.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold">
                              {wrestler.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-white font-medium">{wrestler.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          wrestler.gender === 'female'
                            ? 'bg-pink-500/20 text-pink-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {wrestler.gender === 'female' ? "Women's" : "Men's"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          wrestler.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {wrestler.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditModal(wrestler)}
                          className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors ml-auto"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      No wrestlers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingWrestler && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Edit Wrestler</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateWrestler} className="p-6 space-y-6">
                {/* Preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                  {editImageUrl ? (
                    <img
                      src={editImageUrl}
                      alt={editName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold text-2xl">
                      {editName.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-lg">{editName || 'Wrestler Name'}</p>
                    <p className="text-gray-400 text-sm">
                      {editGender === 'female' ? "Women's Division" : "Men's Division"} • {editIsActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wrestler Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g., John Cena"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as 'male' | 'female')}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="male">Male (Men's Division)</option>
                    <option value="female">Female (Women's Division)</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Leave empty to show default avatar with first initial
                  </p>
                </div>

                {/* Active Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Status
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setEditIsActive(true)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        editIsActive
                          ? 'bg-green-500/20 border-green-500 text-green-400'
                          : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">Active</div>
                      <div className="text-xs mt-1">Currently on roster</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIsActive(false)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        !editIsActive
                          ? 'bg-gray-500/20 border-gray-500 text-gray-300'
                          : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium">Inactive</div>
                      <div className="text-xs mt-1">No longer on roster</div>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
