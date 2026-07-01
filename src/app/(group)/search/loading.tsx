export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="h-[42px] shimmer rounded-[10px]" />

      {/* Results header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-44 shimmer rounded-[6px]" />
          <div className="h-4 w-28 shimmer rounded-[6px]" />
        </div>
        {/* Mobile filter button placeholder */}
        <div className="h-9 w-24 shimmer rounded-[10px] lg:hidden" />
      </div>

      {/* Job card grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[240px] shimmer rounded-[14px]" />
        ))}
      </div>
    </div>
  );
}
