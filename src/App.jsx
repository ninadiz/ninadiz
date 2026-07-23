import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AnnouncementBanner from "./components/AnnouncementBanner.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Contact from "./pages/Contact.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";

function usePageviewTracking() {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
}

export default function App() {
  usePageviewTracking();

  return (
    <>
      <AnnouncementBanner />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cases/:caseName" element={<CaseStudy />} />
      </Routes>
      <Footer />
    </>
  );
}
