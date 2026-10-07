import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const ITEMS = [
  { to: "/cases", label: "Cases" },
  { to: "/contact", label: "Contacts" },
  { to: "/blog", label: "Blog" },
];

// Pill backgrounds are drawn in one SVG behind the links, ported from
// floema.com. For the bridge maths each pill end is a circle of radius h/2;
// neighbours are joined by a metaball neck that thins out as they move apart
// and breaks once the gap exceeds DETACH_DISTANCE.
const DETACH_DISTANCE = 30;
const CORNER = 0.34; // visible corner radius as a share of the pill height
const ANIMATION_MS = 600; // longest margin transition (0.5s) plus slack

// The header stays put for the first PIN_DISTANCE px of scroll, then fades
// out over FADE_DISTANCE px.
const PIN_DISTANCE = 20;
const FADE_DISTANCE = 80;

const pt = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;

function roundedRect(x, y, w, h) {
  const k = Math.min(h * CORNER, w / 2);
  return (
    `M${x + k},${y} H${x + w - k} A${k},${k} 0 0 1 ${x + w},${y + k} ` +
    `V${y + h - k} A${k},${k} 0 0 1 ${x + w - k},${y + h} ` +
    `H${x + k} A${k},${k} 0 0 1 ${x},${y + h - k} ` +
    `V${y + k} A${k},${k} 0 0 1 ${x + k},${y} Z`
  );
}

// x1: centre of the left pill's right end, x2: centre of the right pill's left end.
function bridge(x1, x2, cy, r) {
  const c = x2 - x1;
  if (c <= 0 || c > DETACH_DISTANCE + 2 * r) return "";

  const overlap = c < 2 * r ? Math.acos(c / (2 * r)) : 0;
  const v = 0.3 + (c / (DETACH_DISTANCE + 1.2 * r)) * 0.1;
  const spread = Math.PI / 2; // acos((r1 - r2) / c) for equal radii

  const a1 = overlap + (spread - overlap) * v;
  const a2 = Math.PI - overlap - (Math.PI - overlap - spread) * v;
  const on = (cx, a, dx) => [cx + r * Math.cos(a) + dx, cy + r * Math.sin(a)];
  const A1 = on(x1, a1, 2.5);
  const B1 = on(x1, -a1, 2.5);
  const A2 = on(x2, a2, -2.6);
  const B2 = on(x2, -a2, -2.6);

  const span = Math.hypot(A2[0] - A1[0], A2[1] - A1[1]);
  const handle = r * Math.min(v, span / (2 * r)) * Math.min(1, c / r);
  const towards = ([x, y], a) => [x + handle * Math.cos(a), y + handle * Math.sin(a)];

  // Clockwise, like the pills, so the union fills with the nonzero rule.
  return (
    `M${pt(B1)} C${pt(towards(B1, -a1 + Math.PI / 2))} ${pt(towards(B2, -a2 - Math.PI / 2))} ${pt(B2)} ` +
    `L${pt(A2)} C${pt(towards(A2, a2 + Math.PI / 2))} ${pt(towards(A1, a1 - Math.PI / 2))} ${pt(A1)} Z`
  );
}

function usePillShape(navRef, pathRef) {
  useLayoutEffect(() => {
    const nav = navRef.current;
    const links = [...nav.querySelectorAll(".site-header__pill")];

    const draw = () => {
      const boxes = links.map((el) => ({
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        h: el.offsetHeight,
      }));
      let d = boxes.map((b) => roundedRect(b.x, b.y, b.w, b.h)).join(" ");
      for (let i = 0; i < boxes.length - 1; i++) {
        const a = boxes[i];
        const b = boxes[i + 1];
        const r = a.h / 2;
        d += " " + bridge(a.x + a.w - r, b.x + r, a.y + r, r);
      }
      pathRef.current.setAttribute("d", d);
    };

    // Margins animate without always changing the nav width, so redraw every
    // frame while a transition runs.
    let raf = 0;
    let until = 0;
    const tick = () => {
      draw();
      raf = performance.now() < until ? requestAnimationFrame(tick) : 0;
    };
    const animate = () => {
      until = performance.now() + ANIMATION_MS;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(nav);
    nav.addEventListener("transitionrun", animate);
    return () => {
      observer.disconnect();
      nav.removeEventListener("transitionrun", animate);
      cancelAnimationFrame(raf);
    };
  }, [navRef, pathRef]);
}

function useScrollFade(headerRef) {
  useEffect(() => {
    const el = headerRef.current;
    const update = () => {
      const progress = Math.min(
        Math.max((window.scrollY - PIN_DISTANCE) / FADE_DISTANCE, 0),
        1
      );
      el.style.setProperty("--header-progress", progress);
      el.toggleAttribute("data-hidden", progress >= 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headerRef]);
}

export default function Header() {
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState(null);
  const navRef = useRef(null);
  const pathRef = useRef(null);
  const headerRef = useRef(null);
  usePillShape(navRef, pathRef);
  useScrollFade(headerRef);

  const activeIndex = ITEMS.findIndex((item) =>
    item.to === "/cases"
      ? pathname === "/cases" || pathname.startsWith("/cases/")
      : pathname === item.to
  );

  return (
    <header
      className={"site-header" + (pathname === "/" ? "" : " site-header--on-gray")}
      ref={headerRef}
    >
      <Link className="site-header__btn site-header__brand" to="/">
        Home
      </Link>
      <nav
        className="site-header__nav"
        aria-label="Main"
        ref={navRef}
        onMouseLeave={() => setHovered(null)}
      >
        <svg className="site-header__shape" aria-hidden="true" focusable="false">
          <path ref={pathRef} />
        </svg>
        {ITEMS.map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            className={
              "site-header__pill" +
              (i === activeIndex ? " is-active" : "") +
              (i === hovered ? " is-hover" : "")
            }
            aria-current={i === activeIndex ? "page" : undefined}
            onMouseEnter={() => setHovered(i)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <span className="site-header__actions">
        <a className="site-header__btn" href="/cv.pdf" download>
          Download CV
        </a>
        <button className="site-header__btn" type="button" aria-label="Language: English">
          EN
        </button>
      </span>
    </header>
  );
}
