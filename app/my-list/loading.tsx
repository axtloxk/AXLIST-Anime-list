export default function Loading() {
  return (
    <div className="container min-h-screen px-6 mt-8 py-4 lg:min-w-full lg:px-14 lg:py-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        {/* Back Button Placeholder */}
        <div className="-ml-2.5 h-8 w-8 rounded-md bg-zinc-800/80 lg:ml-0" />
        {/* Page Title Placeholder */}
        <div className="h-8 w-44 rounded-md bg-zinc-800/80" />
      </div>

      {/* Separator Skeleton */}
      <div className="mt-3 mb-5 h-px w-full bg-zinc-800/60" />

      {/* Anime Grid Skeleton */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            {/* Card Poster Placeholder */}
            <div className="aspect-3/4 w-full rounded-xl border border-zinc-800 bg-zinc-800/50 shadow-md" />
            {/* Card Title Placeholder */}
            <div className="h-4 w-5/6 rounded-md bg-zinc-800/80" />
            {/* Card Subtitle/Metadata Placeholder */}
            <div className="h-3 w-1/2 rounded-md bg-zinc-800/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
