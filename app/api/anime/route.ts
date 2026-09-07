import { NextResponse } from "next/server";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filterType = searchParams.get("type") || "all";
  const sortParam = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");

  // 1. mapping frontend sorts/types to AniList GraphQL Enums
  let sortEnum = "POPULARITY_DESC";
  if (sortParam === "newest") sortEnum = "START_DATE_DESC";

  let formatIn = undefined;
  if (filterType === "tv") formatIn = ["TV", "TV_SHORT"];
  if (filterType === "movie") formatIn = ["MOVIE"];

  // 2. The GraphQL Query
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort], $formatIn: [MediaFormat]) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          lastPage
          hasNextPage
        }
        media (type: ANIME, sort: $sort, format_in: $formatIn, isAdult: false) {
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
        }
      }
    }
  `;

  // 3. Variables injected into the query
  const variables = {
    page,
    perPage: limit,
    sort: [sortEnum],
    ...(formatIn && { formatIn }), // Only add formatIn if it's not "all"
  };

  try {
    const res = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      // Extract the actual error AniList sent back
      const errorText = await res.text();
      console.error(`AniList Error (${res.status}):`, errorText);

      return NextResponse.json(
        { error: "AniList fetch failed", details: errorText },
        { status: res.status }, // Pass the 429 or 400 directly to the client
      );
    }

    const { data } = await res.json();

    // 4. Transform AniList data  to match with frontend
    const transformedList = data.Page.media.map((anime: any) => {
      const cleanSynopsis = anime.description
        ? anime.description.replace(/<[^>]*>?/gm, "")
        : "No description available.";

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
      };
    });

    return NextResponse.json({
      data: transformedList,
      page: data.Page.pageInfo.currentPage,
      totalPages: data.Page.pageInfo.lastPage,
      hasNextPage: data.Page.pageInfo.hasNextPage,
    });
  } catch (error) {
    console.error("api/anime/route.ts  ,AniList API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime list" },
      { status: 500 },
    );
  }
}
