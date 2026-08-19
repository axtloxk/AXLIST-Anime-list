"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      /* Combines any layouts props with the core styling engine safely */
      className={`toaster group ${className || ""}`}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-zinc-400" />,
      }}
      style={
        {
          "--normal-bg": "oklch(0.1 0.02 260)",
          "--normal-border": "var(--color-zinc-700, #3f3f46)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[oklch(0.1_0.02_260)] group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-700 group-[.toaster]:shadow-lg w-full",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-900",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",

          // --- Variant Custom Colors ---
          success:
            "group-[.toaster]:bg-[oklch(0.14_0.05_150)] group-[.toaster]:text-emerald-200 group-[.toaster]:border-emerald-800/80",
          error:
            "group-[.toaster]:bg-[oklch(0.14_0.05_25)] group-[.toaster]:text-red-200 group-[.toaster]:border-red-800/80",
          warning:
            "group-[.toaster]:bg-[oklch(0.14_0.05_75)] group-[.toaster]:text-amber-200 group-[.toaster]:border-amber-800/80",
          info: "group-[.toaster]:bg-[oklch(0.14_0.04_250)] group-[.toaster]:text-blue-200 group-[.toaster]:border-blue-800/80",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
