import { Anime, AnimeFetchResponse } from "@/lib/types/anime";

export type FilterType = "all" | "tv" | "movie";
export type SortType = "popular" | "newest";

interface GetAnimeListParams {
  type?: FilterType;
  sort?: SortType;
  page?: number;
  limit?: number;
}

/*
 Fetches anime list via internal Next.js API Route handler.
 */

export async function getAnimeList({
  type = "all",
  sort = "popular",
  page = 1,
  limit = 12,
}: GetAnimeListParams = {}): Promise<AnimeFetchResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      type,
      sort,
    });

    const res = await fetch(`/api/anime?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch anime list: ${res.statusText}`);
    }

    // Since our route.ts now returns the EXACT format we need,
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return {
      data: [],
      page: 1,
      totalPages: 1,
      hasNextPage: false,
    };
  }
}
/**
 * Fetches single anime details via internal Next.js API Route handler.
 */
export async function getAnimeBySlug(slug: string): Promise<Anime | null> {
  try {
    const res = await fetch(
      `/api/anime/detail?slug=${encodeURIComponent(slug)}`,
    );

    if (!res.ok) return null;

    const animeData: Anime = await res.json();
    return animeData;
  } catch (error) {
    console.error(`Failed to fetch anime data for ${slug}:`, error);
    return null;
  }
}
