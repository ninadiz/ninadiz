import { Link } from "react-router-dom";
import "./PillButton.css";

export default function PillButton({
  href,
  children,
  variant = "fill",
  showArrow = variant === "fill",
  newTab = false,
}) {
  const className = `pill-button pill-button--${variant}`;
  const content = (
    <>
      <p>{children}</p>
      {showArrow && <p aria-hidden="true">→</p>}
    </>
  );
  const newTabProps = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

  if (href?.startsWith("/")) {
    return (
      <Link className={className} to={href} {...newTabProps}>
        {content}
      </Link>
    );
  }

  return (
    <a className={className} href={href} {...newTabProps}>
      {content}
    </a>
  );
}
