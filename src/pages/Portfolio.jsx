import PageTitle from "../components/PageTitle.jsx";
import { usePage } from "../lib/page.js";
import "./Page.css";

// Stub, not linked from the menu yet.
export default function Portfolio() {
  usePage("Portfolio");
  return (
    <main className="page-wide">
      <PageTitle>portfolio</PageTitle>
    </main>
  );
}
