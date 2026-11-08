import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { home } from "../lib/home.js";
import LoopVideo from "../components/LoopVideo.jsx";
import { MOBILE_QUERY } from "../lib/breakpoints.js";
import "./Home.css";

// Desktop cards keep a fixed size: only a short window scales them down (never
// above 1x). The exception is the intro card, always 60% of the window width. A wider window just shows more cards in the horizontal lane; the
// wheel scrolls it sideways. The pagination sits PAGINATION_GAP above the
// window bottom and the lane PAGINATION_GAP above the pagination; the rest of
// the height is left between the header and the lane. Up to MOBILE_QUERY the
// lane becomes a plain vertical stack. All text and media come from
// content/home/home.md (see src/lib/home.js).
const LANE_HEIGHT = 600;
const PAGINATION_HEIGHT = 24;
const PAGINATION_GAP = 24;
const MIN_GAP = 16;
const MIN_SCALE = 0.5;
// When the site is opened on the home page, the headline appears word by word
// (timing in .home-card__word in Home.css) and the case card videos start
// when the last word's animation ends. Coming back to the home page later
// inside the app (no reload) shows the headline at once and plays the videos
// straight away.
const openedOnHome =
  typeof window !== "undefined" && window.location.pathname === "/";
let introShown = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const sections = [
  { id: "intro", size: "large", kind: "intro" },
  ...home.cases.map((item, i) => ({
    id: item.slug,
    size: "small",
    kind: "case",
    // notch pattern: first case left and top, second bottom and right
    notch: i % 2 === 0 ? "n1" : "n2",
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

// Splits a multi-line string from home.md into lines joined by <br />.
function Lines({ text }) {
  return (text ?? "").split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));
}

// Headline words wrapped in spans with a running index (--word) for the
// staggered reveal. Spaces stay outside the spans so lines wrap as before.
function Words({ text, start, animate }) {
  const words = (text ?? "").split(/\s+/).filter(Boolean);
  if (!animate) return text;
  return words.map((word, i) => (
    <span key={i}>
      {i > 0 && " "}
      <span className="home-card__word" style={{ "--word": start + i }}>
        {word}
      </span>
    </span>
  ));
}

const wordCount = (text) => (text ?? "").split(/\s+/).filter(Boolean).length;

function Intro({ animate, onRevealEnd }) {
  const intro = home.intro;
  const mutedCount = wordCount(intro.headlineMuted);
  const lastWord = mutedCount + wordCount(intro.headlinePrimary) - 1;
  const onAnimationEnd = (event) => {
    if (event.target.style?.getPropertyValue("--word") === String(lastWord)) {
      onRevealEnd();
    }
  };
  return (
    <div className="home-card home-card--intro">
      <div className="home-card__identity">
        {intro.avatar && (
          <img
            className="home-card__avatar"
            src={intro.avatar}
            alt={intro.avatarAlt ?? ""}
            draggable="false"
            onLoad={(event) => event.currentTarget.classList.add("is-loaded")}
          />
        )}
        <p className="home-card__name">
          <Lines text={intro.name} />
        </p>
      </div>
      <h1
        className={"home-card__headline" + (animate ? " is-revealing" : "")}
        aria-label={animate ? `${intro.headlineMuted} ${intro.headlinePrimary}` : undefined}
        onAnimationEnd={animate ? onAnimationEnd : undefined}
      >
        <span className="home-card__headline-muted" aria-hidden={animate || undefined}>
          <Words text={intro.headlineMuted} start={0} animate={animate} />
        </span>
        <span className="home-card__headline-primary" aria-hidden={animate || undefined}>
          <Words text={intro.headlinePrimary} start={mutedCount} animate={animate} />
        </span>
      </h1>
      <div className="home-card__caption">
        <p>{intro.caption}</p>
      </div>
      <ul className="home-card__icons">
        {intro.links
          .filter((link) => iconPaths[link.icon])
          .map((link) => (
            <li key={link.icon}>
              <a
                className={`home-card__icon home-card__icon--${link.icon}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={iconPaths[link.icon]} />
                </svg>
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}

// Case card: the media (a video or image from home.md, else the case cover)
// centred in the card; the client, year and title appear below it on hover.
// With hoverColor the hover background spreads as a circle from the point
// where the pointer came in, and shrinks back to where it left.
function CaseCard({ item, holdVideo }) {
  // A shimmering skeleton fills the media area until the video's poster or
  // first frame (or the image) has loaded, so a slow connection shows a
  // placeholder instead of an empty card.
  const [mediaReady, setMediaReady] = useState(!item.video && !item.image);
  const onMediaReady = useCallback(() => setMediaReady(true), []);
  const imageRef = useRef(null);
  useEffect(() => {
    const img = imageRef.current;
    if (img?.complete && img.naturalWidth) setMediaReady(true);
  }, []);
  const setOrigin = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--hover-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty("--hover-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };
  const className = [
    "home-card home-card--case",
    item.dark && "home-card--tinted",
    item.hoverColor && "home-card--hover-fill",
    item.hoverColor && (item.hoverDark ? "home-card--hover-dark" : "home-card--hover-light"),
  ]
    .filter(Boolean)
    .join(" ");
  const style = {};
  if (item.color) style["--case-card-color"] = item.color;
  if (item.hoverColor) style["--case-card-hover-color"] = item.hoverColor;
  if (item.hoverMetaColor) style["--case-card-hover-meta"] = item.hoverMetaColor;
  return (
    <Link
      className={className}
      to={`/cases/${item.slug}`}
      style={style}
      onPointerEnter={item.hoverColor ? setOrigin : undefined}
      onPointerLeave={item.hoverColor ? setOrigin : undefined}
    >
      <div className={"home-card__media" + (mediaReady ? "" : " is-loading")}>
        {item.video && (
          <LoopVideo
            src={item.video}
            hevcSrc={item.hevcVideo}
            poster={item.poster}
            hold={holdVideo}
            onReady={onMediaReady}
          />
        )}
        {item.image && (
          <img
            ref={imageRef}
            src={item.image}
            alt=""
            loading="lazy"
            draggable="false"
            onLoad={onMediaReady}
          />
        )}
      </div>
      <div className="home-card__text">
        <p className="home-card__meta">{item.meta}</p>
        <h2 className="home-card__title">{item.title}</h2>
      </div>
    </Link>
  );
}

function Contact() {
  const contact = home.contact;
  return (
    <div className="home-card home-card--contact">
      <h2 className="home-card__headline">{contact.headline}</h2>
      <p className="home-card__contacts">
        {contact.links.map((link, i) => (
          <span key={link.href}>
            {i > 0 && <br />}
            <a href={link.href}>{link.label}</a>
          </span>
        ))}
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
        onResize();
        return;
      }
      // Keep the scroll position as a share of the lane while it is resized.
      const range = lane.scrollWidth - lane.clientWidth;
      const ratio = range > 0 ? lane.scrollLeft / range : 0;
      const header = document.querySelector(".site-header");
      const headerBottom = header ? header.offsetTop + header.offsetHeight : 0;
      const content = LANE_HEIGHT + PAGINATION_HEIGHT;
      const scale = Math.min(
        1,
        Math.max(
          MIN_SCALE,
          (window.innerHeight - headerBottom - MIN_GAP - 2 * PAGINATION_GAP) /
            content
        )
      );
      const paginationY =
        window.innerHeight - PAGINATION_GAP - PAGINATION_HEIGHT * scale;
      const laneY = paginationY - PAGINATION_GAP - LANE_HEIGHT * scale;
      root.setProperty("--desktop-scale", String(scale));
      root.setProperty("--lane-y", `${laneY}px`);
      root.setProperty("--pagination-y", `${paginationY}px`);
      lane.scrollLeft = ratio * (lane.scrollWidth - lane.clientWidth);
      onResize();
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      root.removeProperty("--desktop-scale");
      root.removeProperty("--lane-y");
      root.removeProperty("--pagination-y");
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
  // Animate the headline only the first time, and only if the site was opened
  // on the home page. Videos are held until the animation is over.
  const [animateIntro] = useState(
    () => openedOnHome && !introShown && !prefersReducedMotion()
  );
  const [introDone, setIntroDone] = useState(!animateIntro);

  useEffect(() => {
    introShown = true;
  }, []);

  // The headline's last word finishing its animation starts the videos.
  const onIntroEnd = useCallback(() => setIntroDone(true), []);

  // The active card is the first one that is not mostly scrolled off the left.
  const updateActive = useCallback(() => {
    const lane = laneRef.current;
    if (!lane || window.matchMedia(MOBILE_QUERY).matches) return;
    const left = lane.getBoundingClientRect().left;
    const cards = [...lane.querySelectorAll(".home-section")];
    let best = cards.findIndex((el) => {
      const rect = el.getBoundingClientRect();
      return rect.left + rect.width / 2 >= left;
    });
    if (best < 0) best = cards.length - 1;
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
      ?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div className="home">
      <main className="home-lane" ref={laneRef} onScroll={updateActive}>
        <div className="home-track">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={`home-section home-section--${section.size} home-section--${section.kind}`}
            >
              <div className={`home-surface home-surface--${section.kind}${
                  section.notch ? ` home-surface--${section.notch}` : ""
                }`}>
                {section.kind === "intro" && (
                  <Intro animate={animateIntro} onRevealEnd={onIntroEnd} />
                )}
                {section.kind === "case" && (
                  <CaseCard item={section.item} holdVideo={!introDone} />
                )}
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
