import { useEffect } from "react";
import Timeline from "../components/Timeline.jsx";

export default function Experience() {
  useEffect(() => {
    document.body.classList.add("page-experience");
    return () => document.body.classList.remove("page-experience");
  }, []);

  return <Timeline />;
}
