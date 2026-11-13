import { useState } from "react";
import { Link } from "react-router-dom";
import { cases, coverOf } from "../lib/cases.js";
import UxUiFight from "../components/UxUiFight.jsx";
import PageTitle from "../components/PageTitle.jsx";
import { usePage } from "../lib/page.js";
import "./Page.css";
import "./Cases.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "ux", label: "Heavy UX" },
  { id: "ui", label: "Nice UI" },
];

export default function Cases() {
  usePage("Cases");
  const [filter, setFilter] = useState("all");

  // hidden cases (hidden: true in frontmatter) still open by direct link;
  // a case without `focus` shows under every filter
  const list = Object.values(cases).filter(
    (item) =>
      !item.hidden &&
      (filter === "all" || item.focus.length === 0 || item.focus.includes(filter))
  );

  return (
    <main className="page-wide">
      <PageTitle>cases</PageTitle>

      <div className="cases-switch">
        <div className="cases-filter" role="group" aria-label="Filter cases">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className="cases-filter__option"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="cases-fight">
          <UxUiFight mode={filter} />
        </div>
      </div>

      {list.length === 0 && <p className="cases-empty">No cases here yet.</p>}

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
