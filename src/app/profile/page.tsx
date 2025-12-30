import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import ProfileClient from './ProfileClient'
import { DashboardSkeleton } from '@/components/LoadingSkeleton'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Get user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/profile')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's leagues count
  const { count: leaguesCount } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header user={user} profile={profile || undefined} />
      <Suspense fallback={<DashboardSkeleton />}>
        <ProfileClient
          user={user}
          profile={profile || undefined}
          leaguesCount={leaguesCount || 0}
        />
      </Suspense>
    </div>
  )
}
