type SkeletonProps = {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
  )
}

export function LeagueCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="pt-4 border-t border-gray-700 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-6 w-16 ml-4" />
      </div>
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Active Leagues Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LeagueCardSkeleton />
          <LeagueCardSkeleton />
          <LeagueCardSkeleton />
        </div>
      </section>

      {/* Available Events Section */}
      <section>
        <Skeleton className="h-7 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      </section>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}
