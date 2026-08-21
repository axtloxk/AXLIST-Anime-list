import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="container min-h-screen px-6 mt-5 py-4 lg:min-w-full lg:px-14 lg:py-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        {/* Back Button Placeholder */}
        <div className="-ml-2.5 h-6 w-8 rounded-md bg-zinc-900/60 lg:ml-0" />
        {/* Page Title Placeholder */}
        <div className="h-6 w-40 rounded-md bg-zinc-900/60" />
      </div>

      {/* Separator Skeleton */}
      <div className="mt-7 mb-7 h-px w-full bg-zinc-800/30" />

      {/* Anime Grid Skeleton */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex w-full flex-col rounded-lg border border-zinc-800 bg-zinc-900/30 px-2 py-2 pb-5 "
          >
            <div className="flex aspect-3/4 w-full items-center justify-center rounded-md bg-zinc-900/60"></div>
            <div className="mt-4 h-4 w-3/4 rounded bg-zinc-900/60" />
            <Separator className="mt-3" />
            <div className="flex items-center justify-between px-1 gap-4 mt-3">
              {/* fav, type */}
              {/* <div className="-ml-2.5 h-4 w-6  rounded-sm bg-zinc-900/60 lg:ml-0" /> */}
              {/* Page Title Placeholder */}
              {/* <div className="h-4 w-6 rounded-sm bg-zinc-900/60" /> */}
              <div className="h-4 w-2/4  rounded-sm bg-zinc-900/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
