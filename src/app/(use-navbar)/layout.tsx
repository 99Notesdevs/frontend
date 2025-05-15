import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import { getNavigationTree, getFooterLinks } from "@/lib/navigation";
import { Suspense } from "react";
import GlobalScriptsLoader from "@/components/GlobalScriptsLoader";

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
    <html>
      <head>

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <GlobalScriptsLoader />
        <Suspense
          fallback={
            <div className="text-[var(--text-strong)]">Loading Navbar...</div>
          }
        >
          <Navbar navigation={navigation} />
        </Suspense>
        {children}
        <Suspense
          fallback={
            <div className="text-[var(--text-strong)]">Loading Footer...</div>
          }
        >
          <Footer footerSections={footerSections} />
        </Suspense>
      </body>
    </html>
  );
}
