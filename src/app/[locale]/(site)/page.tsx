import BrowseByTrade from "@/src/components/sections/BrowseByTrade";
import DualCta from "@/src/components/sections/DualCta";
import Hero from "@/src/components/sections/Hero";
import HowItWorks from "@/src/components/sections/HowItWorks";
import WhyKarigaar from "@/src/components/sections/WhyKarigaar";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <HowItWorks />
      <BrowseByTrade />
      <WhyKarigaar />
      <DualCta />
    </main>
  );
}
