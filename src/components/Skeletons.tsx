export function PostCardSkeleton() {
  return (
    <div className="p-5 gb-card mb-3">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-2 min-w-[36px]">
          <div className="w-5 h-5 gb-skeleton rounded" />
          <div className="w-6 h-4 gb-skeleton rounded" />
          <div className="w-5 h-5 gb-skeleton rounded" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 gb-skeleton rounded-full" />
            <div className="w-24 h-3 gb-skeleton rounded" />
            <div className="w-16 h-3 gb-skeleton rounded" />
          </div>
          <div className="w-3/4 h-5 gb-skeleton rounded mb-2" />
          <div className="w-full h-3 gb-skeleton rounded mb-1" />
          <div className="w-2/3 h-3 gb-skeleton rounded mb-3" />
          <div className="flex gap-4">
            <div className="w-20 h-3 gb-skeleton rounded" />
            <div className="w-14 h-3 gb-skeleton rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="p-4 gb-card">
      <div className="flex gap-3.5">
        <div className="w-11 h-11 gb-skeleton rounded-[10px]" />
        <div className="flex-1">
          <div className="w-28 h-4 gb-skeleton rounded mb-2" />
          <div className="w-full h-3 gb-skeleton rounded mb-2" />
          <div className="w-full h-1.5 gb-skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </>
  );
}

export function AgentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <AgentCardSkeleton key={i} />
      ))}
    </div>
  );
}
