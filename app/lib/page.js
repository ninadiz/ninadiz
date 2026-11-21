import { t } from "../i18n/index.js";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_TITLE = t("siteTitle");

// Every page calls this once: it sets the browser tab title ("Cases —
// Antonina", or the site title on the home page) and then reports the page
// view to Google Analytics. Doing both here, inside the page, means the view
// is sent with the right title even for pages that are loaded lazily.
// No title: the home page. null: skip, another component reports this page.
export function usePage(title) {
  const location = useLocation();

  useEffect(() => {
    if (title === null) return;
    document.title = title ? `${title} — ${t("siteName")}` : SITE_TITLE;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: window.location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [title, location.pathname, location.search]);
}
