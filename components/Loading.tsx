"use client";

import { motion } from "motion/react";
import loadingGIF from "@/public/gifs/loadingGIF.gif";
import Image from "next/image";
export default function Loading() {
  // Edit your 2 colors here
  const COLOR_ONE = "#3b82f6";
  const COLOR_TWO = "#ef4444";

  return (
    <div className="flex relative items-center justify-center p-6 w-full">
      <motion.div
        // Creates a half-circle using top and right borders
        className="h-10 w-10 rounded-full border-4 border-t-current border-r-current border-b-transparent border-l-transparent"
        animate={{
          rotate: 360,
          scale: [1.4, 2, 1.4],
          color: [COLOR_ONE, COLOR_TWO, COLOR_ONE],
        }}
        transition={{
          rotate: {
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          color: {
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />
      <Image
        className="rounded-full absolute object-cover w-14 h-14 "
        src={loadingGIF}
        alt="loading-state"
        width={50}
        height={50}
      />
    </div>
  );
}
