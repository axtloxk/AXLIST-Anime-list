export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl text-zinc-100 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="fixed opacity-50 top-4 left-4 w-6 h-6 bg-zinc-800 rounded-md" />

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-start">
        {/* ================= LEFT COLUMN: POSTER SKELETON ================= */}
        <div className="relative aspect-3/4 w-full max-w-75 mx-auto md:mx-0 overflow-hidden rounded-xl border border-zinc-800 shadow-2xl bg-zinc-800/50" />

        {/* ================= RIGHT COLUMN: DETAILS SKELETON ================= */}
        <div className="flex flex-col gap-8">
          {/* Title & Synopsis Skeleton */}
          <section>
            <div className="h-10 md:h-12 w-3/4 bg-zinc-800/80 rounded-md mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-zinc-800/50 rounded-md" />
              <div className="h-4 w-full bg-zinc-800/50 rounded-md" />
              <div className="h-4 w-5/6 bg-zinc-800/50 rounded-md" />
              <div className="h-4 w-4/6 bg-zinc-800/50 rounded-md" />
            </div>
          </section>

          {/* Metadata Grid Skeleton */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 py-10 border-y border-zinc-800/60">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-zinc-800/50 rounded-md" />
                <div className="h-4 w-32 bg-zinc-800/80 rounded-md" />
              </div>
            ))}

            {/* Genres Skeleton */}
            <div className="flex flex-col gap-2 sm:col-span-2 mt-10">
              <div className="h-3 w-16 bg-zinc-800/50 rounded-md mb-1" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-20 bg-zinc-800/80 rounded-full"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Characters Section Skeleton */}
          <section className="pt-2">
            <div className="h-7 w-40 bg-zinc-800/80 rounded-md mb-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-3/4 rounded-lg border border-zinc-800 bg-zinc-800/50"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
