import { Link } from "react-router-dom";
import { cases } from "../lib/cases.js";
import "./Page.css";
import "./Cases.css";

// The cover is the first image in the case body, the same rule the build uses
// for link previews (scripts/prerender-meta.mjs).
function coverOf(caseData) {
  const src = caseData.content.match(/!\[[^\]]*\]\(([^)\s]+)/)?.[1];
  if (!src) return null;
  return caseData.assets[src] ?? caseData.assets[src.split("/").pop()] ?? null;
}

export default function Cases() {
  const list = Object.values(cases);

  return (
    <main className="page">
      <h1 className="page__title">Cases</h1>
      <ul className="cases-list">
        {list.map((item) => {
          const cover = coverOf(item);
          return (
            <li key={item.slug}>
              <Link className="cases-list__card" to={`/cases/${item.slug}`}>
                <div className="cases-list__cover">
                  {cover && <img src={cover} alt="" loading="lazy" />}
                </div>
                <p className="cases-list__meta">
                  {[item.client, item.date].filter(Boolean).join(" · ")}
                </p>
                <h2 className="cases-list__title">{item.title}</h2>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
