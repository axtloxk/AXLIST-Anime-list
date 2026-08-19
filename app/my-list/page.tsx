import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import AnimeCard from "@/components/anime/AnimeCard";
import { getAnimeBySlug } from "@/lib/api";

export default async function MyListPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/auth/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // 2. Fetch the bare IDs and Titles from your database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        savedAnime: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) redirect("/auth/login");

    // 3. Fetch the rich data (Episodes, Year, Rating) from AniList for each saved ID
    const detailedSavedAnime = await Promise.all(
      user.savedAnime.map(async (item) => {
        // Ping AniList using the stored ID
        const fullAnimeData = await getAnimeBySlug(String(item.animeId));

        // If the API returns data, use it
        if (fullAnimeData) {
          return fullAnimeData;
        }

        // Fallback: If AniList fails or rate-limits, fall back to the basic DB data so the page doesn't break
        return {
          id: item.animeId,
          title: item.title,
          titleEnglish: item.title,
          coverImage: item.imageUrl || "",
          slug: String(item.animeId),
          year: undefined,
          episodes: undefined,
          type: "TV",
          rating: 0,
        };
      }),
    );

    return (
      <div className="animate-card-load  container px-6 py-4 lg:min-w-full min-h-screen lg:px-14 lg:py-0">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="opacity-50 hover:opacity-80 
            -ml-2.5 lg:ml-0
            text-muted-foreground hover:text-foreground transition-all"
            aria-label="Back to home"
          >
            <ArrowLeft height={30} width={30} />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            My Saved List
          </h1>
        </div>

        <Separator className="mt-6 mb-7 border-border/60 w-full" />

        {detailedSavedAnime.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Your list is empty.
            </p>
            <p className="text-sm text-muted-foreground/80">
              Go find some great anime to add to your favorites!
            </p>
            <Link
              href="/"
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {/* 4. Map over the newly enriched data instead of the raw Prisma array */}
            {detailedSavedAnime.map((anime, index) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                initialIsSaved={true}
                priority={index < 6}
              />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("[MY_LIST_PAGE_ERROR]", error);
    redirect("/auth/login");
  }
}
