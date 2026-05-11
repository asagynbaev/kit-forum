import { Navigation } from "./components/sections/Navigation";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Program } from "./components/sections/Program";
import { Speakers } from "./components/sections/Speakers";
import { Partners } from "./components/sections/Partners";
import { MapVenue } from "./components/sections/MapVenue";
import { Contacts } from "./components/sections/Contacts";
import { Footer } from "./components/sections/Footer";

export function App() {
  return (
    <div className="relative min-h-[100dvh] bg-canvas text-ink overflow-x-clip">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Program />
        <Speakers />
        <Partners />
        <MapVenue />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
