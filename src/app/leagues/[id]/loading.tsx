import { Skeleton } from '@/components/LoadingSkeleton'

export default function LeagueLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        {/* League Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <Skeleton className="h-7 w-40" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-6 w-12" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
