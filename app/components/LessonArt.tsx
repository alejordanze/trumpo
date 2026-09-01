// Small self-contained SVG diagrams used as visual aids in the lessons.

/** Front view of the mouthpiece with the lips forming the embouchure. */
export function EmbouchureDiagram() {
  return (
    <figure className="lesson-figure">
      <svg viewBox="0 0 280 260" role="img" aria-label="Embouchure on the mouthpiece">
        <defs>
          <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset="1" stopColor="#b9821f" />
          </linearGradient>
        </defs>

        {/* Mouthpiece rim + cup */}
        <circle cx="140" cy="130" r="92" fill="#191309" stroke="url(#rimGrad)" strokeWidth="14" />
        <circle cx="140" cy="130" r="74" fill="#0f0d0a" />

        {/* Lips meeting horizontally with a small aperture */}
        <path d="M72 130 Q140 92 208 130 Z" fill="#c98a72" opacity="0.92" />
        <path d="M72 130 Q140 170 208 130 Z" fill="#b3735c" opacity="0.92" />
        <ellipse cx="140" cy="130" rx="16" ry="4.5" fill="#2a1a12" />

        {/* Labels */}
        <line x1="140" y1="130" x2="140" y2="46" className="fig-leader" />
        <circle cx="140" cy="130" r="4" className="fig-dot" />
        <text x="140" y="36" className="fig-label" textAnchor="middle">
          Aperture
        </text>

        <line x1="210" y1="130" x2="256" y2="196" className="fig-leader" />
        <text x="256" y="214" className="fig-label" textAnchor="end">
          Firm corners
        </text>
      </svg>
      <figcaption>Half top lip, half bottom — buzz through a small, centered aperture.</figcaption>
    </figure>
  );
}

/** A three-step "journey of the air" flow diagram. */
export function AirPathDiagram() {
  return (
    <figure className="lesson-figure wide">
      <svg viewBox="0 0 560 180" role="img" aria-label="How your air travels">
        <defs>
          <linearGradient id="airGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffe08a" />
            <stop offset="1" stopColor="#e8b53a" />
          </linearGradient>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#e8b53a" />
          </marker>
        </defs>

        {/* 1 — belly breath */}
        <g>
          <circle cx="80" cy="80" r="42" fill="none" stroke="url(#airGold)" strokeWidth="6" />
          <line x1="80" y1="80" x2="80" y2="30" className="air-out" markerEnd="url(#arrow)" />
          <line x1="80" y1="80" x2="120" y2="80" className="air-out" markerEnd="url(#arrow)" />
          <line x1="80" y1="80" x2="80" y2="130" className="air-out" markerEnd="url(#arrow)" />
          <line x1="80" y1="80" x2="40" y2="80" className="air-out" markerEnd="url(#arrow)" />
          <text x="80" y="162" className="fig-label" textAnchor="middle">Full belly breath</text>
        </g>

        {/* arrow */}
        <line x1="140" y1="80" x2="212" y2="80" className="air-flow" markerEnd="url(#arrow)" />

        {/* 2 — steady stream */}
        <g>
          <path d="M232 80 q22 -22 44 0 t44 0 t44 0" fill="none" stroke="url(#airGold)" strokeWidth="6" strokeLinecap="round" />
          <text x="298" y="162" className="fig-label" textAnchor="middle">Warm, steady stream</text>
        </g>

        {/* arrow */}
        <line x1="372" y1="80" x2="428" y2="80" className="air-flow" markerEnd="url(#arrow)" />

        {/* 3 — trumpet bell */}
        <g>
          <path d="M452 62 h40 l24 -22 v80 l-24 -22 h-40 Z" fill="url(#airGold)" stroke="#100f0d" strokeWidth="4" strokeLinejoin="round" />
          <text x="492" y="162" className="fig-label" textAnchor="middle">Ringing tone</text>
        </g>
      </svg>
      <figcaption>Your air is the engine: breathe low, blow a steady stream, and the tone sings.</figcaption>
    </figure>
  );
}
