import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { pathname } = useLocation();
  const isPortfolio = pathname === "/portfolio";
  const isCaseStudy = pathname.startsWith("/cases/");

  return (
    <header className="site-header">
      <p className="site-header__title">
        <Link to="/">
          <strong>Ninadiz</strong>
        </Link>
        {!isCaseStudy && <> designs human experiences</>}
      </p>
      <Link className="site-header__link" to={isPortfolio ? "/" : "/portfolio"}>
        {isPortfolio ? "Back to Home" : "Portfolio"}
      </Link>
    </header>
  );
}
