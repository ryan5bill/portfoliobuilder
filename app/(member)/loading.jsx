export default function MemberLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 bg-pb-bg-elevated rounded w-48 mb-2"></div>
        <div className="h-4 bg-pb-bg-elevated rounded w-64"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card">
            <div className="card-body">
              <div className="h-4 bg-pb-bg-elevated rounded w-20 mb-2"></div>
              <div className="h-8 bg-pb-bg-elevated rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="card">
        <div className="card-header">
          <div className="h-5 bg-pb-bg-elevated rounded w-32"></div>
        </div>
        <div className="card-body space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-pb-bg-elevated rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
