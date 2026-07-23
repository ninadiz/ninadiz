import { Routes, Route } from "react-router-dom";
import AnnouncementBanner from "./components/AnnouncementBanner.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Contact from "./pages/Contact.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";

export default function App() {
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
