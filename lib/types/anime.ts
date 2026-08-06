export type AnimeType = "TV" | "Movie" | "OVA" | "Special" | "ONA";

export interface Anime {
  id: string | number;
  title: string;
  titleEnglish?: string;
  titleJapanese?: string;
  synopsis?: string;
  coverImage: string;
  year: number;
  episodes: number | null;
  type: AnimeType;
  rating: number; // Normalized 0 to 5 scale
  slug?: string;
}

// API Response wrapper for paginated lists
export interface AnimeFetchResponse {
  data: Anime[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

/**
 * Transforms a single raw item from Jikan API v4 into the application Anime type.
 */
export function transformJikanAnime(item: any): Anime {
  const rawScore = item.score ?? 0;
  // Convert Jikan's 10-point scale to a 5-point rating scale
  const normalizedRating = Math.round((rawScore / 2) * 10) / 10;

  return {
    id: item.mal_id,
    title: item.title,
    titleEnglish: item.title_english || item.title,
    titleJapanese: item.title_japanese || undefined,
    synopsis: item.synopsis || undefined,
    coverImage:
      item.images?.webp?.large_image_url ||
      item.images?.jpg?.large_image_url ||
      "",
    year: item.year || item.aired?.prop?.from?.year || 0,
    episodes: item.episodes ?? null,
    type: (item.type as AnimeType) || "TV",
    rating: normalizedRating,
    slug: item.mal_id.toString(),
  };
}

/**
 * Transforms a full paginated Jikan API v4 response into AnimeFetchResponse.
 */
export function transformJikanResponse(json: any): AnimeFetchResponse {
  return {
    data: (json.data || []).map(transformJikanAnime),
    page: json.pagination?.current_page || 1,
    totalPages: json.pagination?.last_visible_page || 1,
    hasNextPage: json.pagination?.has_next_page || false,
  };
}
