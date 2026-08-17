import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
}: Readonly<{
  children: React.ReactNode;
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
      </body>
    </html>
  );
}
