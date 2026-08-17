import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function MyListPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/auth/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Fetch user and include their saved anime from Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        savedAnime: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) redirect("/auth/login");

    return (
      <div className="container mx-auto min-h-screen px-6 py-8">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="w-fit rounded-md border border-border/60 bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome to your list,{" "}
            <span className="text-primary">{user.username}</span>!
          </h1>
        </div>

        {/* Separator Line */}
        <hr className="my-6 border-border/60" />

        {/* Saved Anime Cards Grid (Left-to-Right) */}
        {user.savedAnime.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your list is empty. Go find some great anime to add!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {user.savedAnime.map((anime) => (
              <Link
                href={`/anime/${anime.animeId}`} // Links to your getAnimeBySlug dynamic route
                key={anime.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-md"
              >
                {/* Image Wrapper */}
                <div className="aspect-3/4 w-full overflow-hidden bg-muted">
                  {anime.imageUrl ? (
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-sm font-medium text-card-foreground">
                    {anime.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    redirect("/auth/login");
  }
}
