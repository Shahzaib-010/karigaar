import BrowseByTrade from "@/src/components/sections/BrowseByTrade";
import DualCta from "@/src/components/sections/DualCta";
import FeaturedWorkers from "@/src/components/sections/FeaturedWorkers";
import Footer from "@/src/components/sections/Footer";
import Hero from "@/src/components/sections/Hero";
import HowItWorks from "@/src/components/sections/HowItWorks";
import Testimonials from "@/src/components/sections/Testimonials";


export default function Home() {
  return (
    <main className="flex  flex-1 flex-col">
      
      <Hero />
      <HowItWorks />
      <BrowseByTrade />
      <FeaturedWorkers />
      {/* <TrustStrip /> */}
      <DualCta />
      <Testimonials />
      
    </main>
  );
}
