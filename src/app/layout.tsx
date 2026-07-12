import type { Metadata } from "next";
import { Cinzel, Geist } from "next/font/google";
import { MusicPlayer } from "@/components/music/MusicPlayer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { DEFAULT_THEME } from "@/themes/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yogesh Khanal — Frontend Developer",
  description:
    "A graveyard-themed journey through the work, studies, and passions of Yogesh Khanal — frontend developer, BCA student, and nature lover.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${geistSans.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          {children}
          <MusicPlayer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
