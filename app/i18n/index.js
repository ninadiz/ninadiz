import en from "./en.json";
import ru from "./ru.json";

export const locale = /^\/ru(?:\/|$)/.test(window.location.pathname) ? "ru" : "en";
const messages = locale === "ru" ? ru : en;
export const t = (key) => messages[key];

export function localizedHref(href) {
  return locale === "ru" && /^\/(?!\/)/.test(href) ? "/ru" + href : href;
}
