import { Link, useLocation } from "react-router-dom";
import { socialLinks } from "../data/socialLinks.js";
import "./Footer.css";

export default function Footer() {
  const { pathname } = useLocation();
  const isContact = pathname === "/contact";
  const isCaseStudy = pathname.startsWith("/cases/");

  // The home page carries the social links in its intro card.
  if (isCaseStudy || pathname === "/") return null;

  return (
    <footer className="site-footer">
      <ul className="site-footer__social">
        {socialLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      {isContact && (
        <Link className="site-footer__contact" to="/">
          Back to Home
        </Link>
      )}
    </footer>
  );
}
