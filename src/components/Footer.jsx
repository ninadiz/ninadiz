import { useLocation } from "react-router-dom";
import { socialLinks } from "../data/socialLinks.js";
import "./Footer.css";

export default function Footer() {
  const { pathname } = useLocation();
  const isCases = pathname === "/cases" || pathname.startsWith("/cases/");

  // The home page carries the social links in its intro card; the case list
  // and case pages go without them.
  if (isCases || pathname === "/") return null;

  return (
    <footer className="site-footer">
      <ul className="site-footer__social">
        {socialLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
