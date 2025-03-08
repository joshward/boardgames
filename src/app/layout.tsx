import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Quicksand, Crimson_Pro } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const quicksandFont = Quicksand({
  variable: "--font-quicksand-sans",
  subsets: ["latin"],
});

const crimsonFont = Crimson_Pro({
  variable: "--font-crimson-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Josh's Games",
  description: "A listing of Josh Ward's board game collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${quicksandFont.variable} ${crimsonFont.variable}`}
    >
      <body
        className={`bg-slate-1 text-slate-11 relative flex min-h-screen flex-col font-sans antialiased`}
      >
        <div className="from-indigo-8 dark:from-indigo-4 absolute top-0 right-0 left-0 -z-50 h-40 bg-gradient-to-b to-transparent" />
        <header className="flex items-center gap-6 p-4 md:p-6">
          <div className="flex items-center gap-4 md:gap-6">
            <Image
              src="/game.svg"
              alt="Board game logo"
              width="60"
              height="60"
              className="size-[42px] md:size-[60px]"
            />
            <h1 className="text-slate-12 font-serif text-3xl md:text-5xl">
              Josh&apos;s Board Games
            </h1>
          </div>
        </header>
        <div className="grow">{children}</div>
        <footer>footer</footer>
      </body>
    </html>
  );
}
