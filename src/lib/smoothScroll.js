import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const STACK = ".timeline";

let instance = null;

// Jump to a position, bypassing the smoothing (used on route change).
export function scrollToImmediate(y = 0) {
  if (instance) instance.scrollTo(y, { immediate: true });
  else window.scrollTo(0, y);
}

// Smooth, inertial scroll for the sticky card stack only. Lenis keeps native
// scrolling (no transforms), so position: sticky and the header's scroll
// listener keep working. Wheel/touch input that starts outside the stack is
// ignored by Lenis (virtualScroll returns false) and scrolls natively.
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      virtualScroll: ({ event }) => Boolean(event.target?.closest?.(STACK)),
    });
    instance = lenis;

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
