import { Link } from "react-router-dom";
// "/ <page>" is italic: the italic face is loaded only by pages with this title
import "@fontsource-variable/inter/opsz-italic.css";
import "./PageTitle.css";

// Page heading as a breadcrumb: "home / <page>". "home" links to the home
// page and darkens on hover; the slash stays muted.
export default function PageTitle({ children }) {
  return (
    <h1 className="page-title">
      <span className="page-title__trail">
        <Link className="page-title__home" to="/">home</Link> <em>/</em>
      </span>
      <em className="page-title__current">{children}</em>
    </h1>
  );
}
