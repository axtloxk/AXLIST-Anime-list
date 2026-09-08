import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Anime Vault",
  description: "Discover and track your favorite anime",
};

export default function RootLayout({
  children,
  slot,
}: Readonly<{
  children: React.ReactNode;
  slot: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased`}
      >
        {children}
        {slot}
        <Toaster
          position="bottom-left"
          duration={1200}
          className="custom-responsive-toaster"
        />
      </body>
    </html>
  );
}
