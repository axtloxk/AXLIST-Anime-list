"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Star, Tv, Film } from "lucide-react";
import { Anime } from "@/lib/types/anime";

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState<"right" | "left">("right");
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleMouseEnter = () => {
    // Only run hover/popup calculation on desktop/laptop screens (lg / 1024px+)
    if (cardRef.current && window.innerWidth >= 1024) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceOnRight = window.innerWidth - rect.right;
      // Original width of popup (240px / w-60) + margin gap (12px / ml-3)
      const requiredSpace = 260;

      if (spaceOnRight < requiredSpace) {
        setPopupPosition("left");
      } else {
        setPopupPosition("right");
      }
      setIsHovered(true);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${isHovered ? "z-100" : "z-0"} relative  transform-gpu will-change-transform w-full`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: 10, opacity: 0.7 }}
        transition={{ ease: "easeInOut" }}
      >
        <Link href={`/anime/${anime.slug}`} className="group block">
          <div className="relative flex  flex-col overflow-hidden rounded-lg border border-foreground/20 bg-muted/30 backdrop-blur-md transition-colors group-hover:border-zinc-600">
            {/* POSTER CONTAINER */}
            <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-950 ">
              {coverImage ? (
                <Image
                  loading="lazy"
                  fill
                  src={coverImage}
                  alt={displayTitle}
                  className="object-cover  transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900/50 text-zinc-700 text-xs font-mono uppercase tracking-widest">
                  Poster Placeholder
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-transparent to-zinc-950/40 pointer-events-none" />

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
            <div className="flex flex-col justify-between p-2 gap-3">
              <h3
                className="text-base  line-clamp-1 text-[17px] font-semibold text-zinc-100 group-hover:text-gray-300 transition-colors mt-2"
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
                <div className="flex items-center gap-1 font-mono text-[13px] text-zinc-300">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{clampedRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* POPUP CARD */}
      <AnimatePresence>
        {isHovered && <PopUpCard anime={anime} position={popupPosition} />}
      </AnimatePresence>
    </motion.div>
  );
}

// PopUpCard Component (Original size, hidden on sm/md)
function PopUpCard({
  anime,
  position = "right",
}: {
  anime: Anime;
  position?: "left" | "right";
}) {
  const {
    title,
    titleEnglish,
    titleJapanese,
    type,
    episodes,
    rating,
    synopsis,
    status,
    aired,
    genres,
  } = anime;

  const displayTitle = titleEnglish || title;
  const clampedRating = Math.min(5, Math.max(0, rating));

  const isLeft = position === "left";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: isLeft ? 8 : -8 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 10 }}
      exit={{ opacity: 0, x: isLeft ? 2 : -2 }}
      transition={{ duration: 0.23, ease: "easeOut" }}
      className={`pointer-events-none absolute top-0 z-50 hidden lg:block w-60 min-h-55 rounded-xl border border-zinc-800 bg-zinc-900/95 p-4 pb-2 shadow-2xl backdrop-blur-md ${
        isLeft ? "right-full mr-3" : "left-full ml-3"
      }`}
    >
      {/* ENGLISH TITLE */}
      <div className="mb-2">
        <h4 className="line-clamp-1 font-semibold text-zinc-100 text-sm">
          {displayTitle}
        </h4>
      </div>

      {/* HEADER: Rating, Type, Episodes */}
      <div className="flex items-center justify-between border-y border-zinc-800/80 py-2 text-xs">
        <div className="flex items-center gap-1 font-mono text-zinc-200">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{clampedRating.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-zinc-400">
          {type === "Movie" ? (
            <Film className="h-3.5 w-3.5 text-zinc-400" />
          ) : (
            <Tv className="h-3.5 w-3.5 text-zinc-400" />
          )}
          <span>{type}</span>
        </div>

        <span className="rounded bg-zinc-800/80 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
          {episodes ? `${episodes} ${episodes === 1 ? "Ep" : "Eps"}` : "TBA"}
        </span>
      </div>

      {/* MAIN SECTION: Description & Metadata */}
      <div className="mt-3 flex flex-col gap-2">
        <p className="line-clamp-6 text-sm leading-relaxed text-zinc-400">
          {synopsis || "No description available for this title."}
        </p>

        {/* METADATA UNDER DESCRIPTION */}
        <div className="mt-1 flex flex-col gap-1 border-t border-zinc-800/60 pt-2 text-[13px] text-zinc-400">
          {titleJapanese && (
            <p className="line-clamp-1">
              <span className="font-medium text-zinc-300">Japanese:</span>{" "}
              {titleJapanese}
            </p>
          )}
          {status && (
            <p>
              <span className="font-medium text-zinc-300">Status:</span>{" "}
              {status}
            </p>
          )}
          {aired && (
            <p>
              <span className="font-medium text-zinc-300">Aired:</span> {aired}
            </p>
          )}
          {genres && genres.length > 0 && (
            <p className="line-clamp-1">
              <span className="font-medium text-zinc-300">Genres:</span>{" "}
              {genres.join(", ")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
