import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import { App } from "./App";
import { SpeakersPage } from "./pages/SpeakersPage";
import { I18nProvider } from "./i18n/I18nProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/speakers" element={<SpeakersPage />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
);
