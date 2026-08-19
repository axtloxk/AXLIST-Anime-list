"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FilterBar from "./FilterBar";
import { Separator } from "../ui/separator";
import AnimeCard from "./AnimeCard";
import { Anime } from "@/lib/types/anime";
import { getAnimeList, FilterType, SortType } from "@/lib/api";

export default function AnimeGrid() {
  const ITEMS_PER_PAGE = 25;
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef(null);

  const [type, setType] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("popular");

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAnime();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fetchAnime]);

  // fetching pages
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);
      try {
        const response = await getAnimeList({
          limit: ITEMS_PER_PAGE,
          page: page,
        });
        // Append new anime to the existing list
        setAnimeList((prevAnime) => [...prevAnime, ...response.data]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [page]);

  // increasing pages
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the target is visible and we aren't currently loading...
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // Cleanup function
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [isLoading]);

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

      {/* Error State */}
      {error && (
        <div className="my-12 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchAnime}
            className="mt-3 rounded-md bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State (Not Loading, No Error, No Anime) */}
      {!isLoading && !error && animeList.length === 0 && (
        <div className="my-12 text-center text-zinc-500">
          No anime found matching your selected filters.
        </div>
      )}

      {/* Grid Container */}
      <div className="mb-6 mt-8 grid grid-cols-2 gap-7 px-0 sm:grid-cols-3 md:grid-cols-4 md:px-4 lg:grid-cols-5">
        {animeList.map((anime, index) => (
          <AnimeCard key={`${anime.id || anime.slug}-${index}`} anime={anime} />
        ))}

        {isLoading &&
          Array.from({ length: 24 }).map((_, index) => (
            <AnimeCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>

      {!error && <div ref={observerTarget} className="mb-3 h-10 w-full" />}
    </section>
  );
}

// Loading Skeleton Component with centered loading image
function AnimeCardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col rounded-lg border border-zinc-800 bg-zinc-900/30 p-2">
      <div className="flex aspect-3/4 w-full items-center justify-center rounded-md bg-zinc-800/80"></div>
      <div className="mt-3 h-4 w-3/4 rounded bg-zinc-900/60" />
      <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2">
        <div className="h-3 w-12 rounded bg-zinc-900" />
        <div className="h-3 w-8 rounded bg-zinc-900" />
      </div>
    </div>
  );
}
