import { t } from "../i18n/index.js";
import PageTitle from "../components/PageTitle.jsx";
import { usePage } from "../lib/page.js";
import "./Page.css";

// Stub, not linked from the menu yet.
export default function Portfolio() {
  usePage(t("portfolio"));
  return (
    <main className="page-wide">
      <PageTitle>{t("portfolio").toLowerCase()}</PageTitle>
    </main>
  );
}
