import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

// Desktop: the header stays pinned for the first PIN_DISTANCE px of scroll, then
// fades out over FADE_DISTANCE px. Below 1025px it is in the page flow, so it
// just fades while scrolling away.
const PIN_DISTANCE = 20;
const FADE_DISTANCE = 80;
const FLOW_QUERY = "(max-width: 1024px)";

export default function Header() {
  const { pathname } = useLocation();
  const isPortfolio = pathname === "/portfolio";
  const isCaseStudy = pathname.startsWith("/cases/");
  const headerRef = useRef(null);

    useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      const pin = window.matchMedia(FLOW_QUERY).matches ? 0 : PIN_DISTANCE;
      const progress = Math.min(
        Math.max((window.scrollY - pin) / FADE_DISTANCE, 0),
        1
      );
      el.style.setProperty("--header-progress", progress);
      el.style.pointerEvents = progress >= 1 ? "none" : "";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__brand">
        <p className="site-header__title">
          <Link to="/">Home</Link>
        </p>
      </div>
      {isCaseStudy ? (
        <Link className="site-header__close" to="/" aria-label="Close case study" />
      ) : isPortfolio ? (
        <Link className="site-header__link" to="/">
          Back to Home
        </Link>
      ) : (
        <nav className="site-header__menu" aria-label="Main">
          <span className="site-header__links">
            <Link to="/">Cases</Link>
            <Link to="/contact">Contacts</Link>
          </span>
          <span className="site-header__actions">
            <a className="site-header__btn site-header__btn--cv" href="/cv.pdf" download>
              <span aria-hidden="true">📄</span>
              Download CV
            </a>
            <button
              className="site-header__btn site-header__btn--lang"
              type="button"
              aria-label="Language: English"
            >
              <span aria-hidden="true">🌐</span>
              EN
            </button>
          </span>
        </nav>
      )}
    </header>
  );
}
