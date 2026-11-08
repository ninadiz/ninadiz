import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Agentation } from "agentation";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Experience from "./pages/Experience.jsx";
import Skills from "./pages/Skills.jsx";
import Cases from "./pages/Cases.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";
import { scrollToImmediate, useStringTune } from "./lib/stringTune.js";

function usePageviewTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);
}

function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToImmediate(0);
  }, [pathname]);
}

export default function App() {
  useStringTune();
  usePageviewTracking();
  useScrollToTop();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/cases/:caseName" element={<CaseStudy />} />
      </Routes>
      <Footer />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
