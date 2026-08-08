"use client";

import { useState, useEffect, useCallback } from "react";
import FilterBar from "./FilterBar";
import { Separator } from "../ui/separator";
import AnimeCard from "./AnimeCard";
import { Anime } from "@/lib/types/anime";
import { getAnimeList, FilterType, SortType } from "@/lib/api";
export default function AnimeGrid() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Strict type-safe filter and sort states using types imported from lib/api
  const [type, setType] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("popular");

  // Fetch function wrapped in useCallback to prevent infinite loops inside useEffect
  const fetchAnime = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAnimeList({ type, sort, page: 1 });
      setAnimeList(response.data);
    } catch (err) {
      console.error("Failed to fetch anime:", err);
      setError("Failed to load anime. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [type, sort]);

  // // Trigger data fetching whenever the type or sort parameters change
  // useEffect(() => {
  //   fetchAnime();
  // }, [fetchAnime]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAnime();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchAnime]);
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col px-6">
      {/* Filter Bar */}
      <div className="mt-6 w-full">
        <FilterBar
          currentType={type}
          currentSort={sort}
          onTypeChange={(newType) => setType(newType)}
          onSortChange={(newSort) => setSort(newSort)}
        />
      </div>
      <Separator className="mt-3" />

      {/* Grid State Handling: Loading, Error, Empty, or Data */}
      {isLoading ? (
        <div className="mb-6 mt-8 grid grid-cols-2 gap-7 px-0 sm:grid-cols-3 md:grid-cols-4 md:px-4 lg:grid-cols-5">
          {Array.from({ length: 14 }).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="my-12 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchAnime}
            className="mt-3 rounded-md bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
          >
            Retry
          </button>
        </div>
      ) : animeList.length === 0 ? (
        <div className="my-12 text-center text-zinc-500">
          No anime found matching your selected filters.
        </div>
      ) : (
        <div className="mb-6 mt-8 grid grid-cols-2 gap-7 px-0 sm:grid-cols-3 md:grid-cols-4 md:px-4 lg:grid-cols-5">
          {animeList.map((anime) => (
            <AnimeCard key={anime.id || anime.slug} anime={anime} />
          ))}
        </div>
      )}
    </section>
  );
}

// Loading Skeleton Component matching the exact card dimensions and structure
// add a small icon later on.
function AnimeCardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
      <div className="aspect-3/4 w-full rounded-md bg-zinc-800/80" />
      <div className="mt-3 h-4 w-3/4 rounded bg-zinc-800" />
      <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2">
        <div className="h-3 w-12 rounded bg-zinc-800" />
        <div className="h-3 w-8 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
