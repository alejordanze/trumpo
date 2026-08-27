import type { Valve } from "~/lib/notes";

/** The three on-screen valve buttons. Pointer down/up press & release a valve. */
export function ValveButtons({
  pressed,
  onDown,
  onUp,
}: {
  pressed: Set<Valve>;
  onDown: (v: Valve) => void;
  onUp: (v: Valve) => void;
}) {
  return (
    <div className="valves">
      {([1, 2, 3] as Valve[]).map((v) => (
        <button
          key={v}
          type="button"
          className={"valve" + (pressed.has(v) ? " down" : "")}
          aria-pressed={pressed.has(v)}
          aria-label={`Valve ${v}`}
          onPointerDown={(e) => {
            e.preventDefault();
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            onDown(v);
          }}
          onPointerUp={() => onUp(v)}
          onPointerLeave={(e) => {
            // Only release if the pointer button is no longer held.
            if (e.buttons === 0) onUp(v);
          }}
          onPointerCancel={() => onUp(v)}
        >
          <span className="cap" />
          <span className="num">{v}</span>
          <span className="key-hint">
            key <span className="kbd">{v}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
