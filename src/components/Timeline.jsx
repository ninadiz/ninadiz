import { timelineItems } from "../lib/timeline.js";
import TimelineItem from "./TimelineItem.jsx";
import "./Timeline.css";

export default function Timeline() {
  return (
    <main>
      <section className="timeline">
        {timelineItems.map((item, i) => (
          <TimelineItem
            key={i}
            item={item}
            isLast={i === timelineItems.length - 1}
          />
        ))}
      </section>
    </main>
  );
}
