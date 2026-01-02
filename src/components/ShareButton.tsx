'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface ShareButtonProps {
  leagueId: string
  leagueName: string
}

export default function ShareButton({ leagueId, leagueName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/leagues/${leagueId}`
    : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my league: ${leagueName}`,
          text: `Check out my wrestling raffle league on Rumble Raffle!`,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled share or browser doesn't support it
        // Fallback to copy
        handleCopy()
      }
    } else {
      // Fallback to copy if Web Share API not available
      handleCopy()
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="w-4 h-4" />
          <span>Share League</span>
        </>
      )}
    </button>
  )
}
