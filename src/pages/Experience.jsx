import { useEffect } from "react";
import Timeline from "../components/Timeline.jsx";
import PageTitle from "../components/PageTitle.jsx";

export default function Experience() {
  useEffect(() => {
    document.body.classList.add("page-experience");
    return () => document.body.classList.remove("page-experience");
  }, []);

  return <Timeline heading={<PageTitle>experience</PageTitle>} />;
}
