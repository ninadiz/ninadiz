import { useEffect, useState } from "react";
import "./UxUiFight.css";

/*
  A short pixel-art scene under the filter on the Cases page, in the spirit of
  the Chrome offline dino: a blue ninja (UX) and a yellow ninja (UI).
  - "all": both wait in a fighting stance, swaying.
  - "ux":  blue freezes yellow with an ice ball and knocks him down. "UX WINS".
  - "ui":  yellow pulls blue in with a rope spear and knocks him down. "UI WINS".
  It is a fixed script, not a game: each step lasts `d` ms and only lists what
  changes; positions glide between steps with chunky, stepped transitions.
*/

const VIEW_W = 120;
const VIEW_H = 53;
const GROUND = 48; // leaves a gap between the win text and the heads
const BASE_W = 18; // standing body width: the mirror axis, so punches reach forward

/*
  Sprites face right, 18x28 when standing. Letters are colours:
  K outline, C jacket (vest and hood), L jacket highlight, D jacket trim,
  M mask, S face, W eye white, A bare arms, B bracers and shin guards,
  G belt metal, P trousers, H hair and sword grips. "." is empty.
  Both fighters share the body; team extras (yellow's ponytail and swords)
  are drawn behind it by OVERLAYS.
*/
const HEAD = [
  "......KKKKK.......",
  ".....KLLCCCK......",
  "....KLCCCCCCK.....",
  "....KCCCCCCCK.....",
  "....KCCCCCCCK.....",
  "....KCCSSWKSK.....",
  "....KCCMMMMMK.....",
  ".....KCMMMMK......",
  "......KKMMK.......",
];

// vest over a bare chest line, front fist up by the chin, rear arm down
const GUARD = [
  "...KKKDCCCCDKK.KK.",
  "..KAAKDCLCCCDAKAAK",
  "..KAAKDCLCCCDBBBAK",
  "..KAAKDCCCCCDKKKK.",
  "..KBBKDCCCCCDK....",
  "..KBBKDDCCCDDK....",
  "..KAAK.KCCCK......",
];

const BELT = "....KGGKGGGK......";

// dark trousers, the jacket's apron hanging down the middle, metal shin guards
const LEGS = [
  BELT,
  "....KPPCCPPK......",
  "...KPPPCCPPPK.....",
  "...KPPKCCKPPK.....",
  "..KPPK.KK.KPPK....",
  "..KPPK....KPPK....",
  ".KPPK......KPPK...",
  ".KPPK......KPPK...",
  ".KBBK......KBBK...",
  ".KBBK......KBBK...",
  "KKKKK......KKKKK..",
  "KKKKKK.....KKKKKK.",
];

const STANCE = [...HEAD, ...GUARD, ...LEGS];

const RAW = {
  stance: STANCE,
  // second idle frame: upper body one pixel lower, knees bent
  stance2: ["", ...STANCE.slice(0, 21), ...STANCE.slice(22)],
  punch: [
    ...HEAD,
    "...KKKDCCCCDKK.......",
    "..KAAKDCLCCCDKKKKKKK.",
    "..KAAKDCLCCCDAAABBBAK",
    "..KAAKDCCCCCDKKKKKKK.",
    "..KBBKDCCCCCDK.......",
    "..KBBKDDCCCDDK.......",
    "..KAAK.KCCCK.........",
    ...LEGS,
  ],
  kick: [
    ...HEAD,
    ...GUARD,
    BELT,
    "....KPPCCPPPPPPBBBKK",
    "...KPPPCCPPPPPPBBBKK",
    "...KPPKKKKKKKKKKKKK.",
    "..KPPK..............",
    "..KPPK..............",
    ".KPPK...............",
    ".KPPK...............",
    ".KBBK...............",
    ".KBBK...............",
    "KKKKK...............",
    "KKKKKK..............",
  ],
  // flying kick: front leg out, rear leg tucked under
  jumpkick: [
    ...HEAD,
    ...GUARD,
    BELT,
    "....KPPCCPPPPPPBBBKK",
    "...KPPPCCPPPPPPBBBKK",
    "...KPPKKKKKKKKKKKKK.",
    "..KPPPPK............",
    "..KBBKKK............",
    "..KKK...............",
  ],
  hurt: [
    ...HEAD.map((row) => row.slice(2)),
    "..KKDCCCCDK.......",
    "KAAKDCLCCCDK......",
    "KAAKDCLCCCDKKKK...",
    "KBBKDCCCCCDAABBAK.",
    "..KKDCCCCCDKKKKAK.",
    "...KDDCCCDDK..KK..",
    "....KKCCCKK.......",
    ...LEGS,
  ],
  win: [
    "..............KAAK",
    ".....KLLCCCK..KAAK",
    ...HEAD.slice(2).map((row, i) => row.slice(0, 14) + (i < 3 ? "KBBK" : "KAAK")),
    "...KKKDCCCCDKKAAK.",
    "..KAAKDCLCCCDAAK..",
    "..KAAKDCLCCCDKK...",
    "..KAAKDCCCCCDK....",
    "..KBBKDCCCCCDK....",
    "..KBBKDDCCCDDK....",
    "..KAAK.KCCCK......",
    BELT,
    "....KPPCCPPK......",
    "....KPPCCPPK......",
    "....KPPKKPPK......",
    "....KPPKKPPK......",
    "....KPPKKPPK......",
    "....KPPKKPPK......",
    "....KPPKKPPK......",
    "....KBBKKBBK......",
    "....KBBKKBBK......",
    "...KKKKKKKKKK.....",
    "...KKKKKKKKKKK....",
  ],
  // lying on the back, head away from the opponent
  down: [
    "..KKKK......................",
    ".KLCCCK.....KKK.............",
    "KCCSWKKKKKKKAAK.KKKKKKKKKKK.",
    "KCCMMMKDCLCCCDKGKPPPPPPBBKK",
    "KCCMMMKDCCCCCDKKKPPPPPPBBKK",
    ".KKKKKKKKKKKKKKK.KKKKKKKKKK",
  ],
};

/*
  Team extras, painted only into empty cells so they sit behind the body.
  Yellow: a ponytail falling from the back of the hood and two sword grips
  over the shoulders. `at` is where the head sits in each pose.
*/
const OVERLAYS = {
  ui: {
    rows: [
      "...............",
      "...HH..........",
      "..HH...........",
      ".HH............",
      ".HH............",
      "HH.............",
      "H.B............",
      "..HH........B..",
      "...HH......H...",
    ],
    at: { stance: [0, 0], stance2: [0, 1], punch: [0, 0], kick: [0, 0], jumpkick: [0, 0], hurt: [-2, 0], win: [0, 0] },
  },
};

function withOverlay(rows, overlay, at) {
  if (!overlay || !at) return rows;
  const [dx, dy] = at;
  const out = rows.map((row) => [...row]);
  overlay.forEach((line, oy) => {
    [...line].forEach((c, ox) => {
      const x = ox + dx;
      const y = oy + dy;
      if (c === "." || x < 0 || !out[y]) return;
      while (out[y].length <= x) out[y].push(".");
      if (out[y][x] === "." || out[y][x] === undefined) out[y][x] = c;
    });
  });
  return out.map((row) => row.join(""));
}

// Pre-split every row into runs of one colour, so a sprite is a handful of rects.
function toSprite(rows) {
  const w = Math.max(...rows.map((r) => r.length));
  const runs = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let end = x;
      while (row[end + 1] === c) end += 1;
      if (c !== ".") runs.push({ x, y, w: end - x + 1, c });
      x = end + 1;
    }
  });
  return { w, h: rows.length, runs };
}

const SPRITES = Object.fromEntries(
  ["ux", "ui"].map((team) => {
    const overlay = OVERLAYS[team];
    return [
      team,
      Object.fromEntries(
        Object.entries(RAW).map(([name, rows]) => [
          name,
          toSprite(withOverlay(rows, overlay?.rows, overlay?.at[name])),
        ])
      ),
    ];
  })
);

const SHARED = { K: "#1a1a1a", S: "#e9b48c", W: "#ffffff", A: "#dfa47c", G: "#b9bec4", H: "#141414" };
const PALETTES = {
  // blue quilted vest with navy trim, steel mask and bracers, black trousers
  ux: { ...SHARED, C: "#4a8fd8", L: "#94c4f2", D: "#1b3561", M: "#7f8b9b", B: "#6f7a87", P: "#24262c" },
  // yellow vest with black trim, black mask, dark bracers and trousers
  ui: { ...SHARED, C: "#f0c22e", L: "#ffe68a", D: "#1c1c1c", M: "#2e2e2e", B: "#5e5e5e", P: "#1e1e1e" },
  frozen: {
    C: "#cdeeff", L: "#ffffff", D: "#93cdee", M: "#7fb3d6", K: "#5f93b5", S: "#e6f6ff",
    W: "#ffffff", A: "#dff3ff", B: "#a9d6f0", G: "#cfe9f7", P: "#8fbcd9", H: "#5f93b5",
  },
};

// 5-row pixel font, only the letters the scene needs.
const GLYPHS = {
  U: ["X...X", "X...X", "X...X", "X...X", ".XXX."],
  X: ["X...X", ".X.X.", "..X..", ".X.X.", "X...X"],
  I: ["XXX", ".X.", ".X.", ".X.", "XXX"],
  W: ["X...X", "X...X", "X.X.X", "X.X.X", ".X.X."],
  N: ["X...X", "XX..X", "X.X.X", "X..XX", "X...X"],
  S: [".XXXX", "X....", ".XXX.", "....X", "XXXX."],
  " ": ["..", "..", "..", "..", ".."],
};

const SPARK = toSprite(["..X..", "X.X.X", ".XXX.", "X.X.X", "..X.."]);
const ICE = toSprite([".XX.", "XXXX", "XXXX", ".XX."]);
const KUNAI = toSprite(["..X.", "XXXX", "..X."]);

const TOP = GROUND - STANCE.length; // y of a standing sprite's first row
const START = { L: { pose: "stance", x: 14, lift: 0 }, R: { pose: "stance", x: 88, lift: 0 } };
const JUMP_TOP = GROUND - 23; // y of the flying-kick sprite on the ground

// Steps only list what changes; L/R/ice/spear/text carry over, spark does not.
const SCRIPTS = {
  all: [{ d: 600, ...START, ice: null, spear: null, text: null, frozen: null }],
  // both close in, blue freezes yellow mid-walk, the fight happens in the centre
  ux: [
    { d: 450, ...START, ice: null, spear: null, text: null, frozen: null },
    { d: 450, L: { x: 24 }, R: { x: 66 } },
    { d: 160, L: { pose: "punch" }, ice: { x: 43 } },
    { d: 300, L: { pose: "stance" }, R: { x: 58 }, ice: { x: 60 } },
    // yellow stays frozen; blue steps in, leaps and kicks him over, still in ice
    { d: 450, ice: null, frozen: "R", L: { x: 30 } },
    { d: 220, L: { pose: "jumpkick", x: 37, lift: -10 } },
    { d: 160, L: { x: 44, lift: -3 }, spark: { x: 61, y: JUMP_TOP - 3 + 15 } },
    { d: 520, L: { pose: "stance", lift: 0 }, R: { pose: "down", x: 84 } },
    { L: { pose: "win" }, text: "UX WINS" },
  ],
  // both close in, yellow spears blue and pulls him to the centre
  ui: [
    { d: 450, ...START, ice: null, spear: null, text: null, frozen: null },
    { d: 450, L: { x: 24 }, R: { x: 66 } },
    { d: 140, R: { pose: "punch" }, spear: { tip: 62 } },
    { d: 300, spear: { tip: 38 }, L: { pose: "hurt" } },
    { d: 520, spear: { tip: 56 }, L: { x: 44 } },
    { d: 200, spear: null, R: { pose: "stance" }, L: { pose: "stance" } },
    { d: 220, R: { pose: "punch" }, L: { pose: "hurt" }, spark: { x: 54, y: TOP + 8 } },
    { d: 170, R: { pose: "stance" }, L: { pose: "stance" } },
    { d: 260, R: { pose: "kick" }, L: { pose: "hurt", x: 40 }, spark: { x: 54, y: TOP + 15 } },
    { d: 520, R: { pose: "stance" }, L: { pose: "down", x: 16 } },
    { R: { pose: "win" }, text: "UI WINS" },
  ],
};

function resolve(script) {
  const out = [];
  script.forEach((step, i) => {
    const prev = out[i - 1] ?? {};
    out.push({
      ...prev,
      ...step,
      L: { ...prev.L, ...step.L },
      R: { ...prev.R, ...step.R },
      spark: step.spark ?? null,
    });
  });
  return out;
}

const RESOLVED = Object.fromEntries(
  Object.entries(SCRIPTS).map(([mode, script]) => [mode, resolve(script)])
);

const LABELS = {
  all: "Two pixel ninjas, UX in blue and UI in yellow, sway in a fighting stance",
  ux: "The blue UX ninja freezes the yellow UI ninja and knocks him down: UX wins",
  ui: "The yellow UI ninja pulls the blue UX ninja in with a rope spear and knocks him down: UI wins",
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Stepped transition so movement looks frame-by-frame, like an old sprite.
function moveStyle(x, y, ms) {
  return {
    transform: `translate(${x}px, ${y}px)`,
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: `steps(${Math.max(1, Math.round(ms / 70))})`,
  };
}

function Pixels({ sprite, fill, palette }) {
  return sprite.runs.map((r, i) => (
    <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={fill ?? palette[r.c]} />
  ));
}

function Fighter({ state, side, team, frame, frozen, ms }) {
  const pose = state.pose === "stance" && frame ? "stance2" : state.pose;
  const sprite = SPRITES[team][pose];
  const palette = PALETTES[frozen ? "frozen" : team];
  const mirror = side === "R";
  return (
    <g className="fight__move" style={moveStyle(state.x, GROUND - sprite.h + (state.lift ?? 0), ms)}>
      <g transform={mirror ? `translate(${BASE_W} 0) scale(-1 1)` : undefined}>
        <Pixels sprite={sprite} palette={palette} />
      </g>
    </g>
  );
}

function PixelText({ text, y }) {
  const glyphs = [...text].map((ch) => GLYPHS[ch]);
  const width = glyphs.reduce((sum, g) => sum + g[0].length + 1, -1);
  let cursor = Math.round((VIEW_W - width) / 2);
  return (
    <g className="fight__text">
      {glyphs.map((g, gi) => {
        const x0 = cursor;
        cursor += g[0].length + 1;
        return g.flatMap((row, ry) =>
          [...row].map((c, rx) =>
            c === "X" ? <rect key={`${gi}-${rx}-${ry}`} x={x0 + rx} y={y + ry} width={1} height={1} /> : null
          )
        );
      })}
    </g>
  );
}

// Fixed pebbles on the ground line, like the dino's desert.
const PEBBLES = [
  [4, 50, 2], [15, 51, 1], [27, 50, 3], [41, 51, 1], [52, 50, 2], [66, 52, 1],
  [77, 50, 3], [90, 51, 2], [101, 50, 1], [110, 51, 3], [117, 50, 1],
];

export default function UxUiFight({ mode = "all" }) {
  const steps = RESOLVED[mode] ?? RESOLVED.all;
  const [reduced] = useState(prefersReducedMotion);
  const [cursor, setCursor] = useState({ mode, i: 0 });
  const [frame, setFrame] = useState(0);

  // a new filter restarts the scene from its first step
  if (cursor.mode !== mode) setCursor({ mode, i: 0 });
  const i = reduced ? steps.length - 1 : cursor.mode === mode ? cursor.i : 0;
  const step = steps[i];

  useEffect(() => {
    if (reduced || i >= steps.length - 1) return undefined;
    const t = setTimeout(() => setCursor({ mode, i: i + 1 }), steps[i].d);
    return () => clearTimeout(t);
  }, [mode, i, steps, reduced]);

  // idle sway, faster than real time feels "arcade"
  useEffect(() => {
    if (reduced) return undefined;
    const t = setInterval(() => setFrame((f) => 1 - f), 260);
    return () => clearInterval(t);
  }, [reduced]);

  const ms = reduced ? 0 : step.d ?? 0;
  const spearY = TOP + 11;
  const hand = step.R.x - 1;

  return (
    <svg
      className="fight"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={LABELS[mode] ?? LABELS.all}
    >
      <rect className="fight__ground" x={0} y={GROUND} width={VIEW_W} height={1} />
      {PEBBLES.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} className="fight__ground" x={x} y={y} width={w} height={1} />
      ))}

      <Fighter state={step.L} side="L" team="ux" frame={frame} frozen={step.frozen === "L"} ms={ms} />
      <Fighter state={step.R} side="R" team="ui" frame={1 - frame} frozen={step.frozen === "R"} ms={ms} />

      {step.ice && (
        <g className="fight__move" style={moveStyle(step.ice.x, TOP + 9, ms)}>
          <Pixels sprite={ICE} fill={PALETTES.frozen.D} />
        </g>
      )}

      {step.spear && (
        <>
          <rect
            className="fight__move fight__rope"
            x={0}
            y={0}
            width={1}
            height={1}
            style={{
              ...moveStyle(step.spear.tip, spearY, ms),
              transform: `translate(${step.spear.tip}px, ${spearY}px) scaleX(${Math.max(0, hand - step.spear.tip)})`,
            }}
          />
          <g className="fight__move" style={moveStyle(step.spear.tip - 1, spearY - 1, ms)}>
            <Pixels sprite={KUNAI} fill="#555" />
          </g>
        </>
      )}

      {step.spark && (
        <g key={i} className="fight__spark" transform={`translate(${step.spark.x} ${step.spark.y})`}>
          <Pixels sprite={SPARK} fill="#ff5a1f" />
        </g>
      )}

      {step.text && <PixelText text={step.text} y={2} />}
    </svg>
  );
}
