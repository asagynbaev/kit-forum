import { Navigation } from "./components/sections/Navigation";
import { Hero } from "./components/sections/Hero";
import { Program } from "./components/sections/Program";
import { Speakers } from "./components/sections/Speakers";
import { Partners } from "./components/sections/Partners";
import { Contacts } from "./components/sections/Contacts";
import { CityCTA } from "./components/sections/CityCTA";
import { Footer } from "./components/sections/Footer";
import { PageLoader } from "./components/ui/PageLoader";
import { ScrollToTop } from "./components/ui/ScrollToTop";

export function App() {
  return (
    <div className="relative min-h-[100dvh] bg-canvas text-ink overflow-x-clip">
      <PageLoader />
      <ScrollToTop />
      <Navigation />
      <main>
        <Hero />
        <Program />
        <Speakers />
        <Partners />
        <Contacts />
        <CityCTA />
      </main>
      <Footer />
    </div>
  );
}
