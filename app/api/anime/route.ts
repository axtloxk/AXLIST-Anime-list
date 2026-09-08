// import { NextResponse } from "next/server";

// const SHIKIMORI_HOST = "https://shikimori.one";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const filterType = searchParams.get("type") || "all";
//   const sortParam = searchParams.get("sort") || "popular";
//   const page = parseInt(searchParams.get("page") || "1");
//   const limit = parseInt(searchParams.get("limit") || "20");

//   // 1. Mapping frontend sorts/types to Shikimori query params
//   // Shikimori uses 'popularity' for most popular, and 'aired_on' for newest
//   let order = "popularity";
//   if (sortParam === "newest") order = "aired_on";

//   let kindParam = "";
//   if (filterType === "tv") kindParam = "&kind=tv";
//   if (filterType === "movie") kindParam = "&kind=movie";

//   const url = `${SHIKIMORI_HOST}/api/animes?page=${page}&limit=${limit}&order=${order}${kindParam}`;

//   try {
//     const res = await fetch(url, {
//       headers: {
//         Accept: "application/json",
//         "User-Agent": "AXLIST-App", // required for limiting the reqs
//       },
//       next: { revalidate: 3600 },
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error(`Shikimori Error (${res.status}):`, errorText);
//       return NextResponse.json(
//         { error: "Shikimori fetch failed", details: errorText },
//         { status: res.status },
//       );
//     }

//     const data = await res.json();

//     // 2. Transform Shikimori list data to match the Anime type
//     const transformedList = data.map((anime: any) => {
//       const coverImage = anime.image?.original
//         ? `${SHIKIMORI_HOST}${anime.image.original}`
//         : "";

//       const year = anime.aired_on ? parseInt(anime.aired_on.split("-")[0]) : 0;

//       return {
//         id: anime.id,
//         slug: anime.id.toString(),
//         title: anime.name,
//         titleEnglish: anime.name, // Shikimori list endpoint uses Romaji for 'name'
//         titleJapanese: undefined,
//         coverImage: coverImage,
//         year: year,
//         episodes: anime.episodes || anime.episodes_aired || null,
//         type: anime.kind === "movie" ? "Movie" : "TV",
//         rating: anime.score ? parseFloat(anime.score) / 2 : 0,
//         synopsis: "",
//         status: anime.status?.toUpperCase() || "UNKNOWN",
//         aired: year ? `${year}` : "TBA",
//         genres: [],
//       };
//     });

//     const hasNextPage = data.length === limit;

//     return NextResponse.json({
//       data: transformedList,
//       page,
//       totalPages: page + (hasNextPage ? 1 : 0), // Infers total pages for infinite scroll
//       hasNextPage,
//     });
//   } catch (error) {
//     console.error("api/anime/route.ts, Shikimori API Route Error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch anime list" },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filterType = searchParams.get("type") || "all";
  const sortParam = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const offset = (page - 1) * limit;

  // 1. Build Kitsu sort and filter parameters
  let sortQuery = "-userCount"; // Most popular
  if (sortParam === "newest") sortQuery = "-startDate";

  let filterQuery = "";
  if (filterType === "tv") filterQuery = "&filter[subtype]=TV";
  if (filterType === "movie") filterQuery = "&filter[subtype]=movie";

  const url = `https://kitsu.io/api/edge/anime?page[limit]=${limit}&page[offset]=${offset}&sort=${sortQuery}${filterQuery}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Kitsu Error (${res.status}):`, errorText);
      return NextResponse.json(
        { error: "Kitsu fetch failed", details: errorText },
        { status: res.status },
      );
    }

    const json = await res.json();

    // 2. Transform Kitsu payload to your Anime interface
    const transformedList = (json.data || []).map((item: any) => {
      const attr = item.attributes;
      const year = attr.startDate ? parseInt(attr.startDate.split("-")[0]) : 0;
      const rawScore = attr.averageRating ? parseFloat(attr.averageRating) : 0;

      return {
        id: item.id, // Kitsu uses its own integer IDs
        slug: item.id.toString(),
        title: attr.canonicalTitle || attr.titles?.en_jp || attr.titles?.en,
        titleEnglish: attr.titles?.en || attr.canonicalTitle,
        titleJapanese: attr.titles?.ja_jp || undefined,
        // Using Kitsu's high-res 'large' poster image
        coverImage: attr.posterImage?.large || attr.posterImage?.original || "",
        year: year,
        episodes: attr.episodeCount || null,
        type: attr.subtype === "movie" ? "Movie" : "TV",
        rating: attr.averageRating ? Math.round((rawScore / 20) * 10) / 10 : 0, // Convert 1-100 to 1-5
        synopsis: "", // Keeping list data lightweight
        status: attr.status?.toUpperCase() || "UNKNOWN",
        aired: year ? `${year}` : "TBA",
        genres: [],
      };
    });

    const totalCount = json.meta?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: transformedList,
      page,
      totalPages,
      hasNextPage: page < totalPages,
    });
  } catch (error) {
    console.error("api/anime/route.ts, Kitsu API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime list" },
      { status: 500 },
    );
  }
}
