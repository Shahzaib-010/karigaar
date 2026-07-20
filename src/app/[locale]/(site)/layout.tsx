"use client";

import Navbar from "@/src/components/sections/Navbar";
import Footer from "@/src/components/sections/Footer";
import PortalBanner from "@/src/components/site/PortalBanner";
import { usePathname } from "next/navigation";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname.endsWith("/signup") || pathname.endsWith("/login");

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      {isAuthRoute ? null : <PortalBanner />}
      {children}
      {isAuthRoute ? null : <Footer />}
    </div>
  );
}
