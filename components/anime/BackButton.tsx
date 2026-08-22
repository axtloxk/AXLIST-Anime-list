"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      type="button"
      className="absolute lg:fixed opacity-50 top-4 left-4 text-sm text-zinc-400 hover:text-zinc-100 transition-colors z-50 cursor-pointer"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
}
