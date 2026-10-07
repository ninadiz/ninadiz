import { useLayoutEffect, useRef } from "react";
import { timelineItems } from "../lib/timeline.js";
import TimelineItem from "./TimelineItem.jsx";
import "./Timeline.css";

// Each card pins where the previous card's subheader starts, so the previous
// card's title stays visible. Card k pins at: pin(k-1) + (title bottom of k-1
// relative to its top + the text gap). Cards are measured, not hard-coded,
// because titles wrap differently per card and viewport.
//
// If the whole ladder plus the last card does not fit in the viewport, the
// overflow (drift-max) is spread over the scroll progress of the section: every
// pin moves up by drift = drift-max * progress, so the ladder slowly slides up
// while it is being built and the top cards leave the viewport. At the end the
// last card sits fully inside the viewport.
function layoutStack(section) {
  const cards = [...section.querySelectorAll(".timeline-item")];
  let pin = 0;
  cards.forEach((card) => {
    card.style.setProperty("--pin", `${pin}px`);
    const text = card.querySelector(".timeline-item__text");
    const title = card.querySelector(".timeline-item__title");
    if (!text || !title) return;
    const gap = parseFloat(getComputedStyle(text).rowGap) || 0;
    pin += title.getBoundingClientRect().bottom - card.getBoundingClientRect().top + gap;
  });

  let driftMax = 0;
  const last = cards[cards.length - 1];
  if (last) {
    const content = last.querySelector(".timeline-item__content");
    const natural =
      content.lastElementChild.getBoundingClientRect().bottom -
      last.getBoundingClientRect().top +
      parseFloat(getComputedStyle(content).paddingBottom);
    const lastPin = parseFloat(last.style.getPropertyValue("--pin")) || 0;
    driftMax = Math.max(0, lastPin + natural - window.innerHeight);
  }
  section.style.setProperty("--drift-max", `${driftMax}px`);
  updateDrift(section, driftMax);
}

// Progress 0 when the first card pins (section top at the viewport top), 1 when
// the section bottom reaches the viewport bottom (the last card has landed).
function updateDrift(section, driftMax) {
  const rect = section.getBoundingClientRect();
  const range = rect.height - window.innerHeight;
  const progress = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
  section.style.setProperty("--drift", `${driftMax * progress}px`);
}

export default function Timeline() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const update = () => layoutStack(section);
    const onScroll = () =>
      updateDrift(section, parseFloat(section.style.getPropertyValue("--drift-max")) || 0);
    update();
    const observer = new ResizeObserver(update);
    section.querySelectorAll(".timeline-item__title").forEach((el) => observer.observe(el));
    observer.observe(section);
    document.fonts?.ready.then(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main className="timeline-panel">
      <section className="timeline" ref={sectionRef}>
        {timelineItems.map((item, i) => (
          <TimelineItem key={i} item={item} />
        ))}
      </section>
    </main>
  );
}
