import "./Home.css";
import Hero from "../components/Hero.jsx";
import Timeline from "../components/Timeline.jsx";

export default function Home() {
  return (
    <div className="home">
      <Hero />
      <Timeline />
    </div>
  );
}
