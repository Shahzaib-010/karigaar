import Navbar from "@/src/components/sections/Navbar";
import Footer from "@/src/components/sections/Footer";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
