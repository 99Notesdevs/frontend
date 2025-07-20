import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import GlobalScriptsLoader from "@/components/GlobalScriptsLoader";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "99Notes Dashboard",
  description: "99Notes Dashboard - Your content management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <GlobalScriptsLoader />
        {children}
      </body>
    </html>
  );
}
