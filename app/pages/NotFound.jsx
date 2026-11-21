import { t } from "../i18n/index.js";
import PageTitle from "../components/PageTitle.jsx";
import { usePage } from "../lib/page.js";
import "./Page.css";

// Unknown addresses and case slugs. The server falls back to the app for any
// path, so this page is what a mistyped or outdated link shows.
export default function NotFound() {
  usePage(t("notfound"));
  return (
    <main className="page-wide">
      <PageTitle>404</PageTitle>
      <p className="page__subtitle">{t("NotFoundMessage")}</p>
    </main>
  );
}
