import { DashboardSkeleton } from '@/components/LoadingSkeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <DashboardSkeleton />
    </div>
  )
}
