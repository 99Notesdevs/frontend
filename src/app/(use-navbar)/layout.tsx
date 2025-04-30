import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import { getNavigationTree, getFooterLinks } from "@/lib/navigation";
import { Suspense } from "react";

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
        <Suspense fallback={<div className="text-[var(--text-strong)]">Loading Navbar...</div>}>
        <Navbar navigation={navigation} />
        </Suspense>
        {children}
        <Suspense fallback={<div className="text-[var(--text-strong)]">Loading Footer...</div>}>
        <Footer footerSections={footerSections} />
        </Suspense>
    </html>
  );
}
