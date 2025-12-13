import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import { getNavigationTree, getFooterLinks } from "@/lib/navigation";
import { Suspense } from "react";
import GlobalScriptsLoader from "@/components/GlobalScriptsLoader";
import { ThemeProvider } from "@/components/ui/themeprovider";
import GoogleOneTap from "@/components/GoogleOneTap";

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
  const footerSections = await getFooterLinks();

  return (
    <html suppressHydrationWarning>
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
        {/* <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}
      </head>
      <body className={inter.className}>
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
          <Suspense
            fallback={
              <div className="text-foreground">Loading Footer...</div>
            }
          >
            <Footer footerSections={footerSections} />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
