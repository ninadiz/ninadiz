import { useEffect } from "react";
import StringTune, {
  StringLerp,
  StringParallax,
  StringProgress,
  StringResponsive,
  StringSplit,
} from "@fiddle-digital/string-tune";

let instance = null;

// Jump to a position, bypassing the smoothing (used on route change).
export function scrollToImmediate(y = 0) {
  if (instance) instance.scrollTo({ position: y, immediate: true });
  else window.scrollTo(0, y);
}

// Smooth scroll and attribute-driven scroll effects (string="progress",
// "parallax", "split"…), see
// https://string-tune-docs.fiddle.digital/docs/modules/overview.
// The smooth mode moves the native scroll position (window.scrollTo, no
// transforms), so position: sticky in the timeline stack and the header's
// scroll listener keep working. Mobile keeps native scrolling.
// StringTune watches the DOM for added elements, so React route changes need
// no extra calls. It is a singleton: start it once and keep it for the app's
// lifetime (StrictMode re-runs effects, and a destroyed instance cannot be
// restarted).
export function useStringTune() {
  useEffect(() => {
    if (instance) return;

    const stringTune = StringTune.getInstance();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stringTune.scrollDesktopMode = reduceMotion ? "default" : "smooth";
    stringTune.scrollMobileMode = "default";
    // Softer than the defaults (speed 0.09, acceleration 0.8, smoothness 0.5,
    // multiplier 1.1, stopThreshold 0.08): a gentler start, a heavier follow and
    // a longer glide with a quiet stop.
    stringTune.scroll.configure({
      speed: 0.07,
      acceleration: 0.5,
      smoothness: 0.8,
      multiplier: 1,
      stopThreshold: 0.01,
    });

    stringTune.use(StringProgress);
    stringTune.use(StringParallax);
    stringTune.use(StringLerp);
    stringTune.use(StringSplit);
    stringTune.use(StringResponsive);

    // 0 = no frame cap: run on every display frame (120 Hz screens included).
    stringTune.start(0);
    instance = stringTune;
  }, []);
}
