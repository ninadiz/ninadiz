import { useEffect, useId, useRef, useState } from "react";
import "./Tooltip.css";

export default function Tooltip({ children, explanation }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const id = useId();

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
      <span className="tooltip__content" role="tooltip" id={id}>
        {explanation}
      </span>
    </span>
  );
}
