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
  limit = 25,
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

export async function getAnimeBySlug(idString: string): Promise<any | null> {
  const ANILIST_ENDPOINT = "https://graphql.anilist.co";

  // We use the ID from the URL to fetch the exact anime, plus its characters
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          extraLarge
        }
        startDate {
          year
        }
        episodes
        format
        averageScore
        description
        status
        genres
        characters(sort: [ROLE, RELEVANCE], perPage: 4) {
          edges {
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Convert the string "113415" from the URL back into a number for AniList
      body: JSON.stringify({ query, variables: { id: parseInt(idString) } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const { data } = await res.json();
    const anime = data.Media;
    if (!anime) return null;

    // Clean up HTML tags from the description
    const cleanSynopsis = anime.description
      ? anime.description.replace(/<[^>]*>?/gm, "")
      : "No description available.";

    // Format the response to perfectly match what your page.tsx expects
    return {
      id: anime.id,
      slug: anime.id.toString(),
      title: anime.title.romaji || anime.title.english,
      titleEnglish: anime.title.english,
      titleJapanese: anime.title.native,
      coverImage: anime.coverImage?.extraLarge,
      year: anime.startDate?.year,
      episodes: anime.episodes,
      type: anime.format === "MOVIE" ? "Movie" : "TV",
      rating: anime.averageScore ? anime.averageScore / 20 : 0,
      synopsis: cleanSynopsis,
      status: anime.status,
      aired: anime.startDate?.year ? `${anime.startDate.year}` : "TBA",
      genres: anime.genres || [],
      // Map the nested GraphQL character data into a clean, flat array
      characters:
        anime.characters?.edges?.map((edge: any) => ({
          id: edge.node.id,
          name: edge.node.name.full,
          image: edge.node.image.large,
        })) || [],
    };
  } catch (error) {
    console.error(`Failed to fetch anime data for ID ${idString}:`, error);
    return null;
  }
}
