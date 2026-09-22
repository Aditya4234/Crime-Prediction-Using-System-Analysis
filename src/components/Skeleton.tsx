"use client";

export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-cpd-border/50 rounded ${className}`}
    />
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-cpd-bg-secondary border border-cpd-border rounded p-4 space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={i === 0 ? "h-4 w-1/3" : i === 1 ? "h-3 w-2/3" : "h-3 w-1/2"}
        />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden animate-pulse">
      <div className="flex items-center justify-between px-4 py-3 border-b border-cpd-border bg-cpd-bg-secondary">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cpd-border/50" />
          <div className="space-y-1.5">
            <SkeletonLine className="h-3 w-32" />
            <SkeletonLine className="h-2 w-48" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
        <SkeletonCard lines={4} />
      </div>
    </div>
  );
}
