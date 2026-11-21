import { t } from "../i18n/index.js";
import PageTitle from "../components/PageTitle.jsx";
import { usePage } from "../lib/page.js";
import "./Page.css";

export default function Skills() {
  usePage(t("skills"));
  return (
    <main className="page-wide">
      <PageTitle>{t("skills").toLowerCase()}</PageTitle>
      <p className="page__subtitle">{t("SkillsMessage")}</p>
    </main>
  );
}
