import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cases, coverOf } from "../lib/cases.js";
import { socialLinks } from "../data/socialLinks.js";
import avatar from "../../content/home/src/avatar.jpg";
import "./Home.css";

// The desktop layout is a 1600x900 artboard scaled to fit the window. Cards sit
// in a horizontal lane; the wheel scrolls it sideways. Up to MOBILE_MAX the
// lane becomes a plain vertical stack.
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 900;
const MOBILE_QUERY = "(max-width: 768px)";

const sections = [
  { id: "intro", size: "large", kind: "intro" },
  ...Object.values(cases).map((item) => ({
    id: item.slug,
    size: "small",
    kind: "case",
    item,
  })),
  { id: "contact", size: "large", kind: "contact" },
];

const iconPaths = {
  telegram:
    "M21.9 4.6 18.7 19.7c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.1 13.3l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L20 2.7c.9-.3 1.7.2 1.9 1.9Z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z",
  github:
    "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.700-.3-5.500-1.3-5.500-5.900 0-1.3.5-2.400 1.2-3.200-.1-.3-.5-1.500.1-3.200 0 0 1-.3 3.300 1.2a11.500 11.500 0 0 1 6 0c2.300-1.500 3.300-1.2 3.300-1.2.7 1.700.2 2.900.1 3.200.8.800 1.2 1.900 1.2 3.200 0 4.600-2.8 5.600-5.500 5.900.4.400.8 1.1.8 2.200v3.300c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z",
};

const iconOrder = ["github", "telegram", "linkedin"];

const iconLinks = [
  { name: "telegram", label: "Telegram", href: "https://t.me/ninadiz" },
  ...socialLinks
    .filter((link) => ["Linkedin", "Github"].includes(link.label))
    .map((link) => ({ ...link, name: link.label.toLowerCase() })),
].sort((a, b) => iconOrder.indexOf(a.name) - iconOrder.indexOf(b.name));

function Intro() {
  return (
    <div className="home-card home-card--intro">
      <div className="home-card__identity">
        <img
          className="home-card__avatar"
          src={avatar}
          alt="Antonina Khisametdinova"
          draggable="false"
        />
      </div>
      <h1 className="home-card__headline">
        <span className="home-card__headline-muted">
          Product shaping and delivery for modern enterprise software
        </span>
        <span className="home-card__headline-primary">
          in industrial and deep-tech sectors.
        </span>
      </h1>
      <div className="home-card__caption">
        <p>
          13 years of experience in the highly technical sectors: renewable
          energy, oil &amp; gas, utilities, resource extraction, medTech,
          agriTech and others.
        </p>
      </div>
      <ul className="home-card__icons">
        {iconLinks.map((link) => (
          <li key={link.name}>
            <a
              className={`home-card__icon home-card__icon--${link.name}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={iconPaths[link.name]} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CaseCard({ item }) {
  const cover = coverOf(item);
  return (
    <Link className="home-card home-card--case" to={`/cases/${item.slug}`}>
      <div className="home-card__cover">
        {cover && <img src={cover} alt="" loading="lazy" draggable="false" />}
      </div>
      <p className="home-card__meta">
        {[item.client, item.date].filter(Boolean).join(" · ")}
      </p>
      <h2 className="home-card__title">{item.title}</h2>
    </Link>
  );
}

function Contact() {
  return (
    <div className="home-card home-card--contact">
      <h2 className="home-card__headline">Let&apos;s work together</h2>
      <p className="home-card__contacts">
        <a href="mailto:ninadiz2291@gmail.com">ninadiz2291@gmail.com</a>
        <br />
        <a href="https://t.me/ninadiz">Telegram @ninadiz</a>
      </p>
    </div>
  );
}

function useDesktopScale(laneRef, onResize) {
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    const update = () => {
      const lane = laneRef.current;
      if (window.matchMedia(MOBILE_QUERY).matches) {
        root.setProperty("--desktop-scale", "1");
        root.setProperty("--desktop-offset-y", "0px");
        onResize();
        return;
      }
      // Keep the scroll position as a share of the lane while it is resized.
      const range = lane.scrollWidth - lane.clientWidth;
      const ratio = range > 0 ? lane.scrollLeft / range : 0;
      const scale = Math.min(
        window.innerWidth / CANVAS_WIDTH,
        window.innerHeight / CANVAS_HEIGHT
      );
      root.setProperty("--desktop-scale", String(scale));
      root.setProperty(
        "--desktop-offset-y",
        `${Math.max(0, (window.innerHeight - CANVAS_HEIGHT * scale) / 2)}px`
      );
      lane.scrollLeft = ratio * (lane.scrollWidth - lane.clientWidth);
      onResize();
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      root.removeProperty("--desktop-scale");
      root.removeProperty("--desktop-offset-y");
    };
  }, [laneRef, onResize]);
}

// Vertical wheel movement scrolls the lane sideways.
function useWheelToHorizontal(laneRef) {
  useEffect(() => {
    const lane = laneRef.current;
    const onWheel = (event) => {
      if (window.matchMedia(MOBILE_QUERY).matches) return;
      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) return;
      event.preventDefault();
      lane.scrollLeft += delta;
    };
    lane.addEventListener("wheel", onWheel, { passive: false });
    return () => lane.removeEventListener("wheel", onWheel);
  }, [laneRef]);
}

export default function Home() {
  const laneRef = useRef(null);
  const [active, setActive] = useState(0);

  // The active card is the one whose centre is closest to the lane's centre.
  const updateActive = useCallback(() => {
    const lane = laneRef.current;
    if (!lane || window.matchMedia(MOBILE_QUERY).matches) return;
    const mid = lane.getBoundingClientRect().left + lane.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    [...lane.querySelectorAll(".home-section")].forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    // At the very ends the first/last card wins, even if it is off-centre.
    const range = lane.scrollWidth - lane.clientWidth;
    if (lane.scrollLeft <= 1) best = 0;
    else if (lane.scrollLeft >= range - 1) best = sections.length - 1;
    setActive(best);
  }, []);

  useDesktopScale(laneRef, updateActive);
  useWheelToHorizontal(laneRef);

  const goTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className="home">
      <main className="home-lane" ref={laneRef} onScroll={updateActive}>
        <div className="home-track">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`home-section home-section--${section.size}`}
            >
              <div className={`home-surface home-surface--${section.kind}`}>
                {section.kind === "intro" && <Intro />}
                {section.kind === "case" && <CaseCard item={section.item} />}
                {section.kind === "contact" && <Contact />}
              </div>
            </section>
          ))}
        </div>
      </main>
      <nav className="home-pagination" aria-label="Sections">
        {sections.map((section, i) => (
          <button
            key={section.id}
            type="button"
            className={"home-pagination__dot" + (i === active ? " is-active" : "")}
            aria-label={section.id}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(section.id)}
          />
        ))}
      </nav>
    </div>
  );
}
