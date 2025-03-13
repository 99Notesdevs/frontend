import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full max-w-[100vw] mx-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;