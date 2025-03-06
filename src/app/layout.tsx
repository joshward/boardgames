import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksandFont = Quicksand({
  variable: "--font-quicksand-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Josh's Games",
  description: "A listing of Josh Ward's board game collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksandFont.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
