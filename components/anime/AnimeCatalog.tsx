"use client";

import { useEffect, useState, useCallback } from "react";
import { getAnimeList, FilterType, SortType } from "@/lib/api"; // Adjust import path
import { Anime } from "@/lib/types/anime";
import FilterBar from "./FilterBar";
import AnimeCard from "./AnimeCard";

export default function AnimeCatalog() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [type, setType] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("popular");
  const [loading, setLoading] = useState(true);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    const response = await getAnimeList({ type, sort, page: 1 });
    setAnime(response.data);
    setLoading(false);
  }, [type, sort]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAnime();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchAnime]);
  return (
    <div className="w-full space-y-6">
      {/* Top Bar with Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Catalog</h1>
        <FilterBar
          currentType={type}
          currentSort={sort}
          onTypeChange={(newType) => setType(newType as FilterType)}
          onSortChange={(newSort) => setSort(newSort as SortType)}
        />
      </div>

      {/* Anime Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-3/4 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : anime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {anime.map((item) => (
            <AnimeCard key={item.id} anime={item} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          No anime found for the selected filter.
        </div>
      )}
    </div>
  );
}
