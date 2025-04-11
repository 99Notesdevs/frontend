import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Footer/Footer";
import { getNavigationTree, getFooterLinks } from "@/lib/navigation";

const inter = Inter({
  subsets: ["latin"]
});

// export const metadata: Metadata = {
//   title: "99Notes",
//   description: "Your learning companion",
// };

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  const navigation = await getNavigationTree();
  const footerSections = await getFooterLinks();

  return (
    <html>
      <body className={inter.className}>
        <Navbar navigation={navigation} />
        {children}
        <Footer footerSections={footerSections} />
      </body>
    </html>
  );
}
