import PageTitle from "../components/PageTitle.jsx";
import { usePage } from "../lib/page.js";
import "./Page.css";

export default function Skills() {
  usePage("Skills");
  return (
    <main className="page-wide">
      <PageTitle>skills</PageTitle>
      <p className="page__subtitle">Work in progress</p>
    </main>
  );
}
