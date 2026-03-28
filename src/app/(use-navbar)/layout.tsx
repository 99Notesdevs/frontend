import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/navbar";
import FooterCompressed from "@/components/Footer/FooterCompressed";
import { getNavigationTree } from "@/lib/navigation";
import { Suspense } from "react";
import GlobalScriptsLoader from "@/components/GlobalScriptsLoader";
import { ThemeProvider } from "@/components/ui/themeprovider";
import GoogleOneTap from "@/components/GoogleOneTap";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"]
});

// export const metadata: Metadata = {
//   title: "99Notes",
//   description: "Your learning companion",
// };

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = await getNavigationTree();

  return (
    <>
      <div className={inter.className} suppressHydrationWarning>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <GlobalScriptsLoader />
          <Suspense
            fallback={
              <div className="text-foreground">Loading Navbar...</div>
            }
          >
            <Navbar navigation={navigation} />
          </Suspense>
          <main className="min-h-[calc(100vh-64px)] bg-background dark:bg-slate-900 text-foreground">
            <GoogleOneTap />
            {children}
          </main>
          <FooterCompressed />
        </ThemeProvider>
      </div>
    </>
  );
}
