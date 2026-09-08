// export async function getAnimeBySlug(idString: string): Promise<any | null> {
//   try {
//     const headers = {
//       Accept: "application/json",
//       "User-Agent": "AXLIST-App",
//     };

//     // 1. Fetch Anime Details
//     const animeRes = await fetch(`${SHIKIMORI_HOST}/api/animes/${idString}`, {
//       headers,
//       next: { revalidate: 3600 },
//     });

//     if (!animeRes.ok) return null;
//     const anime = await animeRes.json();

//     // 2. Fetch Characters (Roles)
//     const rolesRes = await fetch(
//       `${SHIKIMORI_HOST}/api/animes/${idString}/roles`,
//       {
//         headers,
//         next: { revalidate: 3600 },
//       },
//     );

//     let characters = [];
//     if (rolesRes.ok) {
//       const rolesData = await rolesRes.json();
//       characters = rolesData
//         .filter((r: any) => r.character) // Filter out non-character staff
//         .slice(0, 4) // Keep to 4 characters to match the AniList layout
//         .map((r: any) => ({
//           id: r.character.id,
//           name: r.character.name,
//           image: r.character.image?.original
//             ? `${SHIKIMORI_HOST}${r.character.image.original}`
//             : "",
//           role: r.roles?.[0] || "Unknown",
//         }));
//     }

//     // Clean up HTML from descriptions
//     const cleanSynopsis = anime.description_html
//       ? anime.description_html.replace(/<[^>]*>?/gm, "")
//       : anime.description
//         ? anime.description.replace(/<[^>]*>?/gm, "")
//         : "No description available.";

//     const year = anime.aired_on ? parseInt(anime.aired_on.split("-")[0]) : 0;
//     const coverImage = anime.image?.original
//       ? `${SHIKIMORI_HOST}${anime.image.original}`
//       : "";

//     // Titles logic: Fallback to English, then Romaji (name)
//     const englishTitle = (anime.english && anime.english[0]) || anime.name;
//     const japaneseTitle = (anime.japanese && anime.japanese[0]) || undefined;

//     return {
//       id: anime.id,
//       slug: anime.id.toString(),
//       title: englishTitle,
//       titleEnglish: englishTitle,
//       titleJapanese: japaneseTitle,
//       coverImage: coverImage,
//       year: year,
//       episodes: anime.episodes || anime.episodes_aired || null,
//       type: anime.kind === "movie" ? "Movie" : "TV",
//       rating: anime.score ? parseFloat(anime.score) / 2 : 0,
//       synopsis: cleanSynopsis,
//       status: anime.status?.toUpperCase() || "UNKNOWN",
//       aired: year ? `${year}` : "TBA",
//       genres: anime.genres ? anime.genres.map((g: any) => g.name) : [],
//       characters: characters,
//     };
//   } catch (error) {
//     console.error(`Failed to fetch anime data for ID ${idString}:`, error);
//     return null;
//   }
// }
import { Anime, AnimeFetchResponse } from "@/lib/types/anime";

export type FilterType = "all" | "tv" | "movie";
export type SortType = "popular" | "newest";

interface GetAnimeListParams {
  type?: FilterType;
  sort?: SortType;
  page?: number;
  limit?: number;
}

export async function getAnimeList({
  type = "all",
  sort = "popular",
  page = 1,
  limit = 20,
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

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return { data: [], page: 1, totalPages: 1, hasNextPage: false };
  }
}

export async function getAnimeBySlug(idString: string): Promise<any | null> {
  try {
    const headers = {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      "User-Agent": "AXLIST-App/1.0 (Mozilla/5.0)",
    };

    const isNumericId = /^\d+$/.test(idString);
    let item: any = null;
    let animeJson: any = null;

    if (isNumericId) {
      const res = await fetch(
        `https://kitsu.io/api/edge/anime/${idString}?include=categories`,
        { headers, next: { revalidate: 3600 } },
      );
      if (res.ok) {
        animeJson = await res.json();
        item = animeJson.data;
      }
    } else {
      // 1. Try fetching by slug
      let res = await fetch(
        `https://kitsu.io/api/edge/anime?filter[slug]=${idString}&include=categories`,
        { headers, next: { revalidate: 3600 } },
      );

      if (res.ok) {
        animeJson = await res.json();
        item = animeJson.data?.[0];
      }

      // 2. Fallback: Try direct ID fetch if slug returned empty array
      if (!item) {
        res = await fetch(
          `https://kitsu.io/api/edge/anime/${idString}?include=categories`,
          { headers, next: { revalidate: 3600 } },
        );
        if (res.ok) {
          animeJson = await res.json();
          item = animeJson.data;
        }
      }
    }

    if (!item) {
      console.error(`[AXLIST] Anime not found for target: ${idString}`);
      return null;
    }

    const actualId = item.id;
    const attr = item.attributes;
    const included = animeJson.included || [];

    const genres = included
      .filter((inc: any) => inc.type === "categories")
      .map((c: any) => c.attributes.title);

    // Fetch Characters
    const charRes = await fetch(
      `https://kitsu.io/api/edge/anime/${actualId}/anime-characters?include=character&page[limit]=4`,
      { headers, next: { revalidate: 3600 } },
    );

    let characters = [];
    if (charRes.ok) {
      const charJson = await charRes.json();
      const charData = charJson.data || [];
      const charIncluded = charJson.included || [];

      characters = charData
        .map((ac: any) => {
          const charId = ac.relationships?.character?.data?.id;
          const character = charIncluded.find(
            (inc: any) => inc.type === "characters" && inc.id === charId,
          );

          if (!character) return null;

          return {
            id: character.id,
            name: character.attributes.name,
            image: character.attributes.image?.original || "",
            role: ac.attributes.role || "Unknown",
          };
        })
        .filter(Boolean);
    }

    const year = attr.startDate ? parseInt(attr.startDate.split("-")[0]) : 0;
    const rawScore = attr.averageRating ? parseFloat(attr.averageRating) : 0;

    return {
      id: item.id,
      slug: attr.slug || item.id.toString(),
      title: attr.canonicalTitle || attr.titles?.en_jp || attr.titles?.en,
      titleEnglish: attr.titles?.en || attr.canonicalTitle,
      titleJapanese: attr.titles?.ja_jp || undefined,
      coverImage: attr.posterImage?.large || attr.posterImage?.original || "",
      bannerImage: attr.coverImage?.large || attr.coverImage?.original || "",
      year: year,
      episodes: attr.episodeCount || null,
      type: attr.subtype === "movie" ? "Movie" : "TV",
      rating: attr.averageRating ? Math.round((rawScore / 20) * 10) / 10 : 0,
      synopsis: attr.synopsis || "No description available.",
      status: attr.status?.toUpperCase() || "UNKNOWN",
      aired: year ? `${year}` : "TBA",
      genres: genres,
      characters: characters,
    };
  } catch (error) {
    console.error(`Failed to fetch anime data for ID/Slug ${idString}:`, error);
    return null;
  }
}
