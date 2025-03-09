import { ReactNode } from "react";
import type { Metadata } from "next";
import { Crimson_Pro, Quicksand } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { MainHeader } from "@/app/MainHeader";
import "./globals.css";

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
      className={`${quicksandFont.variable} ${crimsonFont.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-slate-1 text-slate-11 relative flex min-h-screen min-w-[300px] flex-col font-sans antialiased">
        <ThemeProvider attribute="class" enableSystem>
          <div className="from-indigo-8 dark:from-indigo-4 absolute top-0 right-0 left-0 -z-50 h-[300px] w-full bg-gradient-to-b to-transparent" />
          <MainHeader />
          <div className="grow">{children}</div>
          <footer>footer</footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
