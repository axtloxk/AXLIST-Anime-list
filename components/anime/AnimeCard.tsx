"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Star, Tv, Film } from "lucide-react";
import { Anime } from "@/lib/types/anime";

// Mock Frieren data for quick testing and layout previews
export const MOCK_FRIEREN: Anime = {
  id: "frieren-beyond-journeys-end",
  title: "Sousou no Frieren",
  titleEnglish: "Beyond Journey's End",
  coverImage: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
  year: 2023,
  episodes: 28,
  type: "TV",
  rating: 4.9,
  slug: "frieren-beyond-journeys-end",
};

interface AnimeCardProps {
  anime?: Anime;
}

export default function AnimeCard({ anime = MOCK_FRIEREN }: AnimeCardProps) {
  const {
    title,
    titleEnglish,
    coverImage,
    year,
    episodes,
    type,
    rating,
    slug,
    id,
  } = anime;

  const displayTitle = titleEnglish || title;
  const clampedRating = Math.min(5, Math.max(0, rating));

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: 10, opacity: 0.7 }}
      transition={{ ease: "easeInOut" }}
      className="transform-gpu will-change-transform w-full "
    >
      <Link href={`/anime/${slug || id}`} className="group block">
        <div className="relative  flex flex-col  overflow-hidden rounded-lg border border-foreground/20 bg-muted/30 backdrop-blur-md transition-colors group-hover:border-zinc-600">
          {/* POSTER CONTAINER */}
          <div className="relative  aspect-3/4  w-full overflow-hidden bg-zinc-950 ">
            {coverImage ? (
              <Image
                loading="eager"
                fill
                src={coverImage}
                alt={displayTitle}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900/50 text-zinc-700 text-xs font-mono uppercase tracking-widest">
                Poster Placeholder
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/40 pointer-events-none" />

            {/* Year */}
            <div className="absolute top-3 left-3 z-10 rounded-md border border-white/10 bg-zinc-950/60 px-2 py-0.5 text-[11px] font-mono tracking-wider text-zinc-300 backdrop-blur-md shadow-sm">
              {year || "N/A"}
            </div>

            {/* Episodes */}
            <div className="absolute top-3 right-3 z-10 rounded-md border border-white/10 bg-zinc-950/60 px-2 py-0.5 text-[11px] font-mono tracking-wider text-zinc-300 backdrop-blur-md shadow-sm">
              {episodes
                ? `${episodes} ${episodes === 1 ? "Ep" : "Eps"}`
                : "TBA"}
            </div>
          </div>

          {/* CARD BODY */}
          <div className="flex flex-col justify-between p-2 gap-3 ">
            <h3
              className="text-base text-[17px] font-semibold text-zinc-100 group-hover:text-gray-300 transition-colors  mt-2"
              title={displayTitle}
            >
              {displayTitle}
            </h3>

            {/* FOOTER */}
            <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3 mb-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 font-medium text-zinc-400">
                {type === "Movie" ? (
                  <Film className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <Tv className="w-3.5 h-3.5 text-zinc-500" />
                )}
                <span>{type}</span>
              </div>

              {/* Single Star Rating */}
              <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{clampedRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
