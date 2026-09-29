import { useState, type KeyboardEvent, type SVGProps } from "react";

interface Part {
  n: number;
  name: string;
  desc: string;
  marker: [number, number];
  target: [number, number];
  anchor?: "start" | "middle" | "end";
}

const PARTS: Part[] = [
  {
    n: 1,
    name: "Mouthpiece",
    desc: "The cup you buzz into; it detaches for practice and cleaning.",
    marker: [74, 66],
    target: [66, 214],
    anchor: "start",
  },
  {
    n: 2,
    name: "Lead pipe",
    desc: "Carries your air from the mouthpiece into the instrument.",
    marker: [246, 58],
    target: [238, 214],
    anchor: "middle",
  },
  {
    n: 3,
    name: "Valves (1, 2, 3)",
    desc: "Pressing them reroutes air through extra tubing to change the pitch.",
    marker: [406, 60],
    target: [390, 172],
    anchor: "middle",
  },
  {
    n: 4,
    name: "Tuning slide",
    desc: "The main U-bend you pull in or out to tune the whole trumpet.",
    marker: [82, 468],
    target: [206, 302],
    anchor: "start",
  },
  {
    n: 5,
    name: "Valve slides",
    desc: "Smaller slides that fine-tune each valve's pitch.",
    marker: [370, 492],
    target: [490, 348],
    anchor: "middle",
  },
  {
    n: 6,
    name: "Bell",
    desc: "The flared end that projects and colors your sound.",
    marker: [886, 70],
    target: [850, 246],
    anchor: "end",
  },
  {
    n: 7,
    name: "Water key",
    desc: "A small lever (the spit valve) that drains condensation.",
    marker: [744, 474],
    target: [650, 356],
    anchor: "middle",
  },
  {
    n: 8,
    name: "Finger hook",
    desc: "Where your right-hand ring finger or pinky rests to steady the horn.",
    marker: [570, 490],
    target: [505, 272],
    anchor: "middle",
  },
];

const VALVES = [340, 390, 440];

function TubeStroke({
  d,
  active,
  size = "body",
  tone = "brass",
  ...props
}: {
  d: string;
  active?: boolean;
  size?: "body" | "slide" | "brace";
  tone?: "brass" | "silver";
} & SVGProps<SVGGElement>) {
  return (
    <g
      className={`tube-segment ${size} ${tone}${active ? " active" : ""}`}
      {...props}
    >
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
              <stop offset="0" stopColor="#8f5a10" />
              <stop offset="0.28" stopColor="#f3c75c" />
              <stop offset="0.52" stopColor="#a76812" />
              <stop offset="0.78" stopColor="#f9dc7d" />
              <stop offset="1" stopColor="#6f4109" />
            </linearGradient>
            <linearGradient id="partsSilverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6f8f8" />
              <stop offset="0.42" stopColor="#aab2b7" />
              <stop offset="0.72" stopColor="#e4e8e9" />
              <stop offset="1" stopColor="#747d82" />
            </linearGradient>
          </defs>

          <g className="trumpet-drawing">
            <path
              className={`bell-shell${active === 6 ? " active" : ""}`}
              d="M566 220 C646 216 738 184 844 126 C870 112 889 132 892 168 C896 211 896 277 892 320 C889 356 870 376 844 362 C738 304 646 272 566 268 C584 256 584 232 566 220 Z"
              {...handlers(6)}
            />
            <ellipse
              className="bell-inner"
              cx="854"
              cy="244"
              rx="27"
              ry="112"
              {...handlers(6)}
            />
            <ellipse
              className={`bell-rim${active === 6 ? " active" : ""}`}
              cx="858"
              cy="244"
              rx="37"
              ry="125"
              {...handlers(6)}
            />
            <path
              className="bell-shadow"
              d="M590 230 C676 226 756 191 844 139 C775 204 704 242 590 250 Z"
            />
            <path
              className="bell-highlight"
              d="M592 222 C674 220 744 198 830 151 C756 213 681 238 594 239"
            />

            <TubeStroke
              d="M112 214 C198 214 282 214 448 214"
              active={active === 2}
              {...handlers(2)}
            />
            <TubeStroke d="M330 230 C412 228 496 228 584 232" />
            <TubeStroke d="M438 314 C492 314 544 298 574 266" />
            <TubeStroke
              d="M238 214 C203 214 184 232 184 262 C184 291 204 306 238 306 L318 306"
              active={active === 4}
              {...handlers(4)}
            />
            <TubeStroke
              d="M234 306 L310 306"
              active={active === 4}
              size="slide"
              tone="silver"
              {...handlers(4)}
            />
            <TubeStroke
              d="M570 266 C582 252 586 240 584 232"
              size="slide"
            />
            <TubeStroke
              d="M112 214 L86 214"
              active={active === 1}
              size="slide"
              tone="silver"
              {...handlers(1)}
            />
            <TubeStroke
              d="M206 214 L284 214"
              active={active === 2}
              size="slide"
              tone="silver"
              {...handlers(2)}
            />

            {VALVES.map((x, i) => (
              <g
                key={x}
                className={`valve-stack${active === 3 ? " active" : ""}`}
                {...handlers(3)}
              >
                <rect
                  x={x - 15}
                  y={188}
                  width={30}
                  height={132}
                  rx={14}
                  className="valve-casing"
                />
                <rect
                  x={x - 19}
                  y={184}
                  width={38}
                  height={13}
                  rx={6}
                  className="valve-collar"
                />
                <rect
                  x={x - 19}
                  y={311}
                  width={38}
                  height={13}
                  rx={6}
                  className="valve-collar"
                />
                <line x1={x} y1={156} x2={x} y2={184} className="valve-stem" />
                <ellipse
                  cx={x}
                  cy={146 - i * 2}
                  rx={20}
                  ry={9}
                  className="valve-button"
                />
              </g>
            ))}

            <TubeStroke
              d="M340 314 C340 346 314 354 300 334 C290 319 300 296 318 292"
              active={active === 5}
              size="slide"
              {...handlers(5)}
            />
            <TubeStroke
              d="M390 190 C390 168 414 166 416 190"
              active={active === 5}
              size="slide"
              {...handlers(5)}
            />
            <TubeStroke
              d="M440 312 C454 322 476 326 500 326 L616 326 C648 326 648 360 616 360 L478 360 C456 360 446 344 446 322"
              active={active === 5}
              size="slide"
              tone="silver"
              {...handlers(5)}
            />

            <TubeStroke d="M292 218 L292 302" size="brace" />
            <TubeStroke d="M548 234 L548 294" size="brace" />

            <g
              className={`mouthpiece${active === 1 ? " active" : ""}`}
              {...handlers(1)}
            >
              <line x1="76" y1="214" x2="112" y2="214" className="mouth-stem" />
              <path
                d="M78 204 L67 204 C61 197 52 194 43 196 L34 205 L34 223 L43 232 C52 234 61 231 67 224 L78 224 Z"
                className="mouth-cup"
              />
              <path
                d="M42 204 C52 201 61 207 66 214"
                className="mouth-glow"
              />
            </g>

            <path
              d="M468 248 C500 246 514 264 504 282 C497 295 481 296 479 282"
              className={`finger-hook${active === 8 ? " active" : ""}`}
              {...handlers(8)}
            />
            <g
              className={`water-key${active === 7 ? " active" : ""}`}
              {...handlers(7)}
            >
              <circle cx="650" cy="356" r="8" />
              <line x1="650" y1="356" x2="678" y2="376" />
            </g>

            <path d="M124 207 L202 207" className="painted-highlight" />
            <path d="M466 222 L558 225" className="painted-highlight" />
            <path
              d="M194 246 C187 266 193 286 208 296"
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
