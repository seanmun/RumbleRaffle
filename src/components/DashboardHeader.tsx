'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from './Header'

type DashboardHeaderProps = {
  user: {
    id: string
    email?: string
  }
  profile?: {
    name?: string
    is_admin?: boolean
  } | null
  leagues?: Array<{
    id: string
    name: string
    status: string
  }>
}

export default function DashboardHeader({ user, profile, leagues }: DashboardHeaderProps) {
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
      profile={profile || undefined}
      leagues={leagues}
      onLogout={handleLogout}
    />
  )
}
