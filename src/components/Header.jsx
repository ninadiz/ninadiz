import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { pathname } = useLocation();
  const isAbout = pathname === "/about";

  return (
    <header className="site-header">
      <p className="site-header__title">
        <Link to="/">
          <strong>Ninadiz</strong>
        </Link>{" "}
        designs and builds things
      </p>
      <Link className="site-header__link" to={isAbout ? "/" : "/about"}>
        {isAbout ? "Back to Home" : "About"}
      </Link>
    </header>
  );
}
