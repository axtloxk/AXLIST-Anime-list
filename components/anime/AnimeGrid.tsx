"use client";

import { useState, useEffect, useRef } from "react";
import FilterBar from "./FilterBar";
import { Separator } from "../ui/separator";
import AnimeCard from "./AnimeCard";
import { Anime } from "@/lib/types/anime";
import { getAnimeList, FilterType, SortType } from "@/lib/api";

export default function AnimeGrid() {
  const ITEMS_PER_PAGE = 20;
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef(null);
  const [savedIds, setSavedIds] = useState<Set<number | string>>(new Set());

  const [type, setType] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("popular");

  // 1. Handle Initial Load & Filter Changes (Resets to Page 1)
  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAnimeList({
          type,
          sort,
          page: 1,
          limit: ITEMS_PER_PAGE,
        });
        if (isMounted) {
          setAnimeList(response.data);
          setPage(1);
          setHasNextPage(response.hasNextPage);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch anime:", err);
          setError("Failed to load anime. Please try again later.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Debounce filter changes
    const timeoutId = setTimeout(() => {
      fetchInitial();
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      isMounted = false; // Cleanup to prevent state updates on unmounted components
    };
  }, [type, sort]);

  // 2. Handle Pagination (Triggered by page increments)
  useEffect(() => {
    // Skip page 1 as it's handled by the filter useEffect above
    if (page === 1) return;

    let isMounted = true;

    const fetchMore = async () => {
      setIsLoading(true);
      try {
        // Bug fixed: Now passing type and sort to subsequent pages
        const response = await getAnimeList({
          type,
          sort,
          page,
          limit: ITEMS_PER_PAGE,
        });
        if (isMounted) {
          setAnimeList((prevAnime) => [...prevAnime, ...response.data]);
          setHasNextPage(response.hasNextPage);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          // Crucial: Stop paginating if the fetch fails (prevents infinite loop on 500/429 errors)
          setHasNextPage(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMore();

    return () => {
      isMounted = false;
    };
  }, [page, type, sort]);

  // 3. The Intersection Observer
  useEffect(() => {
    // Stop the observer entirely if we are loading or have run out of pages
    if (isLoading || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }, // Lowered to 0.1 so it triggers slightly before hitting the exact bottom pixel
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [isLoading, hasNextPage]);

  // 4. Fetch Saved IDs
  useEffect(() => {
    async function fetchSavedIds() {
      try {
        const res = await fetch("/api/saved-anime");
        if (res.ok) {
          const ids: string | string[] = await res.json();
          setSavedIds(new Set(ids));
        }
      } catch (err) {
        console.error("Failed to fetch saved IDs", err);
      }
    }
    fetchSavedIds();
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col px-6">
      <div className="mt-6 w-full">
        <FilterBar
          currentType={type}
          currentSort={sort}
          onTypeChange={(newType) => setType(newType)}
          onSortChange={(newSort) => setSort(newSort)}
        />
      </div>
      <Separator className="mt-3" />

      {error && (
        <div className="my-12 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => setPage(1)} // Reset page to trigger a clean retry
            className="mt-3 rounded-md bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && animeList.length === 0 && (
        <div className="my-12 text-center text-zinc-500">
          No anime found matching your selected filters.
        </div>
      )}

      <div className="mb-6 mt-8 grid grid-cols-2 gap-7 px-0 sm:grid-cols-3 md:grid-cols-4 md:px-4 lg:grid-cols-5">
        {animeList.map((anime, index) => (
          <AnimeCard
            key={`${anime.id || anime.slug}-${index}`}
            anime={anime}
            initialIsSaved={savedIds.has(anime.id)}
          />
        ))}

        {isLoading &&
          Array.from({ length: 24 }).map((_, index) => (
            <AnimeCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>

      {/* The observer target now only renders if there is actually a next page */}
      {!error && hasNextPage && (
        <div ref={observerTarget} className="mb-3 h-10 w-full" />
      )}
    </section>
  );
}

function AnimeCardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col rounded-lg border pb-4 border-zinc-800 bg-zinc-900/30 p-2">
      <div className="flex aspect-3/4 w-full items-center justify-center rounded-md bg-zinc-900/60"></div>
      <div className="mt-3 h-4 w-3/4 rounded bg-zinc-900/60" />
      <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2">
        <div className="h-3 w-12 rounded bg-zinc-900" />
        <div className="h-3 w-8 rounded bg-zinc-900" />
      </div>
    </div>
  );
}
