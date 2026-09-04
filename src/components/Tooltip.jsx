import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "./Tooltip.css";

const VIEWPORT_MARGIN = 12;

export default function Tooltip({ children, explanation }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const id = useId();

  function positionContent() {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    content.style.left = "0px";
    const wrapperLeft = wrapper.getBoundingClientRect().left;
    const contentWidth = content.offsetWidth;
    const naturalRight = wrapperLeft + contentWidth;
    const viewportWidth = window.innerWidth;

    if (naturalRight <= viewportWidth - VIEWPORT_MARGIN) return;

    const maxLeft = viewportWidth - VIEWPORT_MARGIN - contentWidth - wrapperLeft;
    const minLeft = VIEWPORT_MARGIN - wrapperLeft;
    content.style.left = `${Math.max(maxLeft, minLeft)}px`;
  }

  // Keep tooltips on-screen for hover/focus (desktop) as well as tap (mobile).
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("mouseenter", positionContent);
    wrapper.addEventListener("focusin", positionContent);
    window.addEventListener("resize", positionContent);
    return () => {
      wrapper.removeEventListener("mouseenter", positionContent);
      wrapper.removeEventListener("focusin", positionContent);
      window.removeEventListener("resize", positionContent);
    };
  }, []);

  useLayoutEffect(() => {
    if (open) positionContent();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <span className={`tooltip${open ? " tooltip--open" : ""}`} ref={wrapperRef}>
      <button
        type="button"
        className="tooltip__trigger"
        aria-expanded={open}
        aria-describedby={id}
        onClick={() => setOpen((value) => !value)}
      >
        {children}
      </button>
      <span className="tooltip__content" role="tooltip" id={id} ref={contentRef}>
        {explanation}
      </span>
    </span>
  );
}
