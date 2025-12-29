'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from './Header'

type HeaderWithLogoutProps = {
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
}

export default function HeaderWithLogout({ user, profile, leagues }: HeaderWithLogoutProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Header
      user={user}
      profile={profile}
      leagues={leagues}
      onLogout={user ? handleLogout : undefined}
    />
  )
}
