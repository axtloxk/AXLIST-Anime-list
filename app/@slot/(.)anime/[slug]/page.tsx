import Image from "next/image";
import { Star, Tv, Film } from "lucide-react";
import { getAnimeBySlug } from "@/lib/api";
import { BackButton } from "@/components/anime/BackButton";
import { ScrollLock } from "@/components/anime/ScrollLocker";

export default async function InterceptedAnimePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const anime = await getAnimeBySlug(slug);

  if (!anime) return null;

  return (
    <div className="fixed inset-0 z-150 bg-background overflow-y-auto min-h-screen ">
      {/* <ScrollLock /> */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl text-zinc-100 relative">
        <BackButton />

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-start">
          {/* LEFT COLUMN: POSTER */}
          <div className="relative aspect-3/4 w-full max-w-75 mx-auto md:mx-0 overflow-hidden rounded-xl border border-zinc-800 shadow-2xl">
            <Image
              src={anime.coverImage}
              alt={anime.titleEnglish || anime.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 300px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/40 pointer-events-none" />

            <div className="absolute top-3 left-3 rounded-md bg-zinc-950/80 px-2 py-1 text-xs font-mono tracking-wider text-zinc-300 backdrop-blur-md">
              {anime.episodes ? `${anime.episodes} EPS` : "TBA"}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-sm font-semibold">
              <div className="flex items-center gap-1.5 drop-shadow-md">
                {anime.type === "Movie" ? (
                  <Film className="w-4 h-4 text-zinc-300" />
                ) : (
                  <Tv className="w-4 h-4 text-zinc-300" />
                )}
                <span>{anime.type}</span>
              </div>
              <div className="flex items-center gap-1 drop-shadow-md">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{anime.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS */}
          <div className="flex flex-col gap-8">
            <section>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                {anime.titleEnglish || anime.title}
              </h1>
              <p className="text-zinc-400 leading-relaxed text-base md:text-[19px]">
                {anime.synopsis}
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 py-6 border-y border-zinc-800/60 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-medium">English Title</span>
                <span className="text-zinc-200">
                  {anime.titleEnglish || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-medium">
                  Japanese Title
                </span>
                <span className="text-zinc-200">
                  {anime.titleJapanese || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-medium">Airing</span>
                <span className="text-zinc-200">
                  {anime.aired || "Unknown"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-medium">Status</span>
                <span className="text-zinc-200">{anime.status}</span>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
                <span className="text-zinc-500 font-medium mb-1">Genres</span>
                <div className="flex flex-wrap gap-2">
                  {anime.genres?.map((genre: string) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-zinc-800/50 rounded-full text-xs font-medium text-zinc-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="pt-2">
              <h2 className="text-xl font-bold mb-4">Main Characters</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {anime.characters?.map((character: any) => (
                  <div
                    key={character.id}
                    className="group relative aspect-3/4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
                  >
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-center text-sm font-medium text-zinc-100 drop-shadow-md">
                      {character.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
