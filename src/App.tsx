import { Navigation } from "./components/sections/Navigation";
import { Hero } from "./components/sections/Hero";
import { Program } from "./components/sections/Program";
import { Speakers } from "./components/sections/Speakers";
import { Partners } from "./components/sections/Partners";
import { Contacts } from "./components/sections/Contacts";
import { CityCTA } from "./components/sections/CityCTA";
import { DigitalNomadBanner } from "./components/sections/DigitalNomadBanner";
import { Footer } from "./components/sections/Footer";
import { PageLoader } from "./components/ui/PageLoader";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { RegistrationModal } from "./components/ui/RegistrationModal";
import { RegistrationModalProvider } from "./context/RegistrationModalContext";

export function App() {
  return (
    <RegistrationModalProvider>
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
          <DigitalNomadBanner />
        </main>
        <Footer />
        <RegistrationModal />
      </div>
    </RegistrationModalProvider>
  );
}
