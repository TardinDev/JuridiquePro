export function StatCardSkeleton() {
  return (
    <div className="h-28 animate-pulse rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="h-11 w-11 rounded-xl bg-muted" />
        <div className="h-8 w-12 rounded bg-muted" />
      </div>
      <div className="mt-4 h-4 w-28 rounded bg-muted" />
    </div>
  )
}

export function ListRowSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 rounded bg-muted" />
          <div className="h-3 w-64 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}
