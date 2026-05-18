import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import { App } from "./App";
import { SpeakersPage } from "./pages/SpeakersPage";
import { ArchivePage } from "./pages/ArchivePage";
import { PressPage } from "./pages/PressPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { AdminPage } from "./pages/AdminPage";
import { KitAwardPage } from "./pages/KitAwardPage";
import { I18nProvider } from "./i18n/I18nProvider";
import { RouteScrollReset } from "./components/ui/RouteScrollReset";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <RouteScrollReset />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/kit-award" element={<KitAwardPage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
);
