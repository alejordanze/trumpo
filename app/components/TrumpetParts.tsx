import { useState, type KeyboardEvent, type SVGProps } from "react";

interface Part {
  n: number;
  name: string;
  desc: string;
  marker: [number, number];
  target: [number, number];
  anchor?: "start" | "middle" | "end";
}

const ROTATION_DEG = 18;
const ROTATION_CENTER = [480, 250] as const;
const DRAW_SHIFT_Y = 36;

function target(x: number, y: number): [number, number] {
  const radians = (ROTATION_DEG * Math.PI) / 180;
  const dx = x - ROTATION_CENTER[0];
  const dy = y - ROTATION_CENTER[1];

  return [
    Math.round(
      ROTATION_CENTER[0] + dx * Math.cos(radians) - dy * Math.sin(radians),
    ),
    Math.round(
      ROTATION_CENTER[1] +
        dx * Math.sin(radians) +
        dy * Math.cos(radians) +
        DRAW_SHIFT_Y,
    ),
  ];
}

const PARTS: Part[] = [
  {
    n: 1,
    name: "Mouthpiece",
    desc: "The cup you buzz into; it detaches for practice and cleaning.",
    marker: [88, 54],
    target: target(106, 160),
    anchor: "start",
  },
  {
    n: 2,
    name: "Lead pipe",
    desc: "Carries your air from the mouthpiece into the instrument.",
    marker: [302, 58],
    target: target(332, 190),
    anchor: "middle",
  },
  {
    n: 3,
    name: "Valves (1, 2, 3)",
    desc: "Pressing them reroutes air through extra tubing to change the pitch.",
    marker: [486, 60],
    target: target(400, 142),
    anchor: "middle",
  },
  {
    n: 4,
    name: "Tuning slide",
    desc: "The main U-bend you pull in or out to tune the whole trumpet.",
    marker: [64, 300],
    target: target(140, 254),
    anchor: "start",
  },
  {
    n: 5,
    name: "Valve slides",
    desc: "Smaller slides that fine-tune each valve's pitch.",
    marker: [330, 488],
    target: target(386, 330),
    anchor: "middle",
  },
  {
    n: 6,
    name: "Bell",
    desc: "The flared end that projects and colors your sound.",
    marker: [886, 112],
    target: target(846, 242),
    anchor: "end",
  },
  {
    n: 7,
    name: "Water key",
    desc: "A small lever (the spit valve) that drains condensation.",
    marker: [706, 488],
    target: target(586, 270),
    anchor: "middle",
  },
  {
    n: 8,
    name: "Finger hook",
    desc: "Where your right-hand ring finger or pinky rests to steady the horn.",
    marker: [520, 488],
    target: target(500, 280),
    anchor: "middle",
  },
];

const VALVES = [350, 400, 450];

function TubeStroke({
  d,
  active,
  size = "body",
  ...props
}: {
  d: string;
  active?: boolean;
  size?: "body" | "slide" | "brace";
} & SVGProps<SVGGElement>) {
  return (
    <g className={`tube-segment ${size}${active ? " active" : ""}`} {...props}>
      <path className="tube-ink" d={d} />
      <path className="tube-brass" d={d} />
    </g>
  );
}

export function TrumpetParts() {
  const [selected, setSelected] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? selected;
  const activePart = PARTS.find((part) => part.n === active) ?? PARTS[0];

  const handlers = (n: number) => ({
    onMouseEnter: () => setHovered(n),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(n),
    onBlur: () => setHovered(null),
    onClick: () => setSelected(n),
    onKeyDown: (event: KeyboardEvent<Element>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setSelected(n);
    },
  });

  return (
    <div className="parts-explorer">
      <div className="parts-diagram">
        <svg
          viewBox="0 0 960 560"
          role="img"
          aria-label="Labelled diagram of a trumpet"
          className="parts-svg"
        >
          <defs>
            <linearGradient id="partsGoldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe08a" />
              <stop offset="0.48" stopColor="#eba928" />
              <stop offset="1" stopColor="#aa6c14" />
            </linearGradient>
            <linearGradient id="partsBellGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff0a8" />
              <stop offset="0.42" stopColor="#f0a51e" />
              <stop offset="1" stopColor="#8c5710" />
            </linearGradient>
          </defs>

          <g
            className="trumpet-drawing"
            transform={`translate(0 ${DRAW_SHIFT_Y}) rotate(${ROTATION_DEG} ${ROTATION_CENTER[0]} ${ROTATION_CENTER[1]})`}
          >
            <path
              className={`bell-shell${active === 6 ? " active" : ""}`}
              d="M620 190 C690 178 766 132 854 104 C888 96 910 122 912 154 C916 205 916 280 912 326 C910 358 888 384 854 376 C766 348 690 302 620 290 C652 262 652 218 620 190 Z"
              {...handlers(6)}
            />
            <ellipse
              className="bell-inner"
              cx="854"
              cy="240"
              rx="33"
              ry="116"
              {...handlers(6)}
            />
            <ellipse
              className={`bell-rim${active === 6 ? " active" : ""}`}
              cx="854"
              cy="240"
              rx="45"
              ry="132"
              {...handlers(6)}
            />
            <path
              className="bell-shadow"
              d="M646 214 C720 206 782 176 846 134 C790 192 742 230 646 254 Z"
            />

            <TubeStroke
              d="M146 190 C262 190 430 190 642 190"
              active={active === 2}
              {...handlers(2)}
            />
            <TubeStroke d="M164 230 C300 230 460 230 632 230" />
            <TubeStroke d="M192 270 C300 270 410 270 532 270" />
            <TubeStroke
              d="M142 190 C96 196 92 262 190 270"
              active={active === 4}
              {...handlers(4)}
            />
            <TubeStroke
              d="M214 270 C162 282 154 338 226 342 C302 346 310 278 244 278"
              active={active === 4}
              size="slide"
              {...handlers(4)}
            />
            <TubeStroke
              d="M548 270 C586 272 616 250 620 230 C626 210 638 196 656 190"
              size="slide"
            />
            <TubeStroke
              d="M176 190 L116 158"
              active={active === 1}
              size="slide"
              {...handlers(1)}
            />

            {VALVES.map((x, i) => (
              <g
                key={x}
                className={`valve-stack${active === 3 ? " active" : ""}`}
                {...handlers(3)}
              >
                <rect
                  x={x - 17}
                  y={126}
                  width={34}
                  height={172}
                  rx={16}
                  className="valve-casing"
                />
                <rect
                  x={x - 21}
                  y={128}
                  width={42}
                  height={14}
                  rx={7}
                  className="valve-collar"
                />
                <rect
                  x={x - 21}
                  y={284}
                  width={42}
                  height={14}
                  rx={7}
                  className="valve-collar"
                />
                <line x1={x} y1={106} x2={x} y2={126} className="valve-stem" />
                <ellipse
                  cx={x}
                  cy={102 - i * 2}
                  rx={21}
                  ry={12}
                  className="valve-button"
                />
              </g>
            ))}

            <TubeStroke
              d="M334 298 C332 344 370 344 370 298"
              active={active === 5}
              size="slide"
              {...handlers(5)}
            />
            <TubeStroke
              d="M386 298 C384 356 426 356 426 298"
              active={active === 5}
              size="slide"
              {...handlers(5)}
            />
            <TubeStroke
              d="M438 298 C436 340 476 340 476 298"
              active={active === 5}
              size="slide"
              {...handlers(5)}
            />

            <TubeStroke d="M292 196 L250 264" size="brace" />
            <TubeStroke d="M574 222 L522 268" size="brace" />

            <g
              className={`mouthpiece${active === 1 ? " active" : ""}`}
              {...handlers(1)}
            >
              <line x1="74" y1="142" x2="118" y2="158" className="mouth-stem" />
              <path
                d="M62 116 L108 134 L94 174 L48 156 Z"
                className="mouth-cup"
              />
              <path
                d="M64 124 L96 136 L88 158 L56 148 Z"
                className="mouth-glow"
              />
            </g>

            <path
              d="M498 260 C530 266 532 302 502 306"
              className={`finger-hook${active === 8 ? " active" : ""}`}
              {...handlers(8)}
            />
            <g
              className={`water-key${active === 7 ? " active" : ""}`}
              {...handlers(7)}
            >
              <circle cx="586" cy="270" r="9" />
              <line x1="588" y1="270" x2="610" y2="294" />
            </g>

            <path d="M242 188 L318 188" className="painted-highlight" />
            <path d="M488 188 L594 188" className="painted-highlight" />
            <path
              d="M232 270 C206 278 194 300 206 318"
              className="painted-highlight"
            />
          </g>

          {PARTS.map((part) => (
            <g
              key={part.n}
              className={`hotspot${active === part.n ? " active" : ""}`}
              tabIndex={0}
              role="button"
              aria-label={`${part.name}: ${part.desc}`}
              {...handlers(part.n)}
            >
              <line
                x1={part.marker[0]}
                y1={part.marker[1]}
                x2={part.target[0]}
                y2={part.target[1]}
                className="leader"
              />
              <circle
                cx={part.target[0]}
                cy={part.target[1]}
                r={4}
                className="leader-dot"
              />
              <circle
                cx={part.marker[0]}
                cy={part.marker[1]}
                r={17}
                className="marker"
              />
              <text
                x={part.marker[0]}
                y={part.marker[1] + 6}
                className="marker-num"
              >
                {part.n}
              </text>
              {active === part.n && (
                <text
                  x={part.marker[0]}
                  y={part.marker[1] - 26}
                  textAnchor={part.anchor ?? "middle"}
                  className="marker-label"
                >
                  {part.name}
                </text>
              )}
            </g>
          ))}
        </svg>

        <div className="part-readout" aria-live="polite">
          <span className="part-readout-num">
            {String(activePart.n).padStart(2, "0")}
          </span>
          <div>
            <b>{activePart.name}</b>
            <p>{activePart.desc}</p>
          </div>
        </div>
      </div>

      <div className="parts-grid">
        {PARTS.map((part) => (
          <button
            type="button"
            key={part.n}
            className={`part${active === part.n ? " active" : ""}`}
            aria-pressed={selected === part.n}
            {...handlers(part.n)}
          >
            <span className="part-num">{part.n}</span>
            <span className="part-copy">
              <b>{part.name}</b>
              <span>{part.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
