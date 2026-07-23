import { Link, useLocation } from "react-router-dom";
import { socialLinks } from "../data/socialLinks.js";
import "./Footer.css";

export default function Footer() {
  const { pathname } = useLocation();
  const isContact = pathname === "/contact";

  return (
    <footer className="site-footer">
      <ul className="site-footer__social">
        {socialLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <Link className="site-footer__contact" to={isContact ? "/" : "/contact"}>
        {isContact ? "Back to Home" : "Contact"}
      </Link>
    </footer>
  );
}
