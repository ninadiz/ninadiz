import { useLocation } from "react-router-dom";
import { locale } from "./index.js";

const translations = import.meta.glob("/content/cases/*/index.ru.md", { eager: true, query: "?raw", import: "default" });
export function LanguageLink({ casePage = false }) {
  const { pathname, search, hash } = useLocation();
  const english = locale === "en";
  const slug = pathname.split("/")[2];
  if (english && casePage && !translations[`/content/cases/${slug}/index.ru.md`]) return null;
  return <a className={"site-header__btn" + (casePage ? " case-language" : "")}
    lang={locale} hrefLang={english ? "ru" : "en"}
    aria-label={english ? "EN — switch to Russian" : "RU — переключить на английский"}
    href={(english ? "/ru" : "") + pathname + search + hash}>{locale.toUpperCase()}</a>;
}
