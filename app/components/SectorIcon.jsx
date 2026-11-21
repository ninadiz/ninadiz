import "./SectorIcon.css";

// Line icons for the industries on the home intro card, taken from the
// "icons" frame in Figma (Portfolio Cases). All drawn on a 24 x 24 grid with
// stroke only; the stroke width comes from CSS (--sector-stroke in
// SectorIcon.css). The parts that move on hover are the layers named
// "anim/…" in Figma and have the class sector-icon__motion (and
// sector-icon__motion-2 / -3 for more moving parts) here. Each Figma layer's
// position is kept as a translate() on its path.
const BLADE = "M0 0C.6202 1.5949.9264 3.8963.2926 6";

const ICONS = {
  // wind turbine: the rotor spins, the two gusts of wind blow past one
  // after the other
  renewable: (
    <>
      <path d="M2 22h20M10 13v9" />
      <g className="sector-icon__motion">
        <circle cx="10" cy="11" r="2" />
        <path d={BLADE} transform="translate(10 3)" />
        <path d={BLADE} transform="rotate(120 10 11) translate(10 3)" />
        <path d={BLADE} transform="rotate(240 10 11) translate(10 3)" />
      </g>
      <path className="sector-icon__motion-2" d="M16 7h4a2 2 0 0 0 0-4h-1" />
      <path className="sector-icon__motion-3" d="M16 10h4" />
    </>
  ),
  // derrick with an oil drop: the drop falls from the pipe
  oilgas: (
    <>
      <path d="M6 5v16.16M18 5v5M6 9h12M10 2h4M5 5h14M5 22h5" />
      <g className="sector-icon__motion">
        <path
          transform="translate(13.5098 13.5586)"
          d="M5.5623 2.9792A3.0901 3.0901 0 1 1 .618 2.9792L2.7098.1902A.475.475 0 0 1 3.4705.1902Z"
        />
      </g>
    </>
  ),
  // pickaxe (Lucide "pickaxe", ISC license, paths copied in; the library is
  // not imported): swings from the end of its handle
  extraction: (
    <g className="sector-icon__motion">
      <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999" />
      <path d="M15.973 4.027A13 13 0 0 0 5.902 2.373c-1.398.342-1.092 2.158.277 2.601a19.9 19.9 0 0 1 5.822 3.024" />
      <path d="M16.001 11.999a19.9 19.9 0 0 1 3.024 5.824c.444 1.369 2.26 1.676 2.603.278A13 13 0 0 0 20 8.069" />
      <path d="M18.352 3.352a1.205 1.205 0 0 0-1.704 0l-5.296 5.296a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l5.296-5.296a1.205 1.205 0 0 0 0-1.704z" />
    </g>
  ),
  // lightning bolt: flickers
  utilities: (
    <path
      className="sector-icon__motion"
      d="M13.5 2 5 13.5h6.5L10.5 22 19 10.5h-6.5L13.5 2Z"
    />
  ),
  // heart with a heartbeat line: a pulse runs along the line
  medtech: (
    <>
      <path d="M12 21c-4.5624-3.8967-10-7.25-10-12.25C2 5.5743 4.6862 3 8 3c1.5 0 2.8426.5459 4 1.5C13.1574 3.5459 14.5 3 16 3c3.3138 0 6 2.5743 6 5.75 0 5-5.4376 8.3533-10 12.25Z" />
      <path className="sector-icon__track" d="M2.3805 11H9l1-3 3 6 1-3h7.6195" />
      <path
        className="sector-icon__motion"
        d="M2.3805 11H9l1-3 3 6 1-3h7.6195"
        pathLength="1"
      />
    </>
  ),
  // sprout: sways above the ground
  agritech: (
    <>
      <path d="M5 22h14" />
      <g className="sector-icon__motion">
        <path d="M12 22V11" />
        <path
          transform="translate(3.5263 7.2368)"
          d="M8.4737 7.2632C8.4737 2.5421 5.0842 0 0 0c0 4.7211 3.3895 7.2632 8.4737 7.2632Z"
        />
        <path
          transform="translate(12 3)"
          d="M0 7.8684C0 2.9053 3.5105 0 8.4737 0c0 4.9632-3.5105 7.8684-8.4737 7.8684Z"
        />
      </g>
    </>
  ),
};

export default function SectorIcon({ icon, label }) {
  if (!ICONS[icon]) return null;
  return (
    <span
      className={`sector-icon sector-icon--${icon}`}
      role="img"
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {ICONS[icon]}
      </svg>
    </span>
  );
}
