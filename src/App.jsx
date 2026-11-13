import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import { scrollToImmediate, useStringTune } from "./lib/stringTune.js";

// Home is in the main bundle (the site is usually opened there); the other
// pages load as separate chunks on first visit, so the home page does not
// download the Markdown renderer and the case diagrams.
const Portfolio = lazy(() => import("./pages/Portfolio.jsx"));
const Experience = lazy(() => import("./pages/Experience.jsx"));
const Skills = lazy(() => import("./pages/Skills.jsx"));
const Cases = lazy(() => import("./pages/Cases.jsx"));
const CaseStudy = lazy(() => import("./pages/CaseStudy.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
// dev-only feedback tool, never part of the production build
const Agentation = import.meta.env.DEV
  ? lazy(() => import("agentation").then((m) => ({ default: m.Agentation })))
  : null;

function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToImmediate(0);
  }, [pathname]);
}

export default function App() {
  useStringTune();
  useScrollToTop();

  return (
    <>
      <Header />
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/cases/:caseName" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      <Footer />
      {Agentation && (
        <Suspense fallback={null}>
          <Agentation />
        </Suspense>
      )}
    </>
  );
}
