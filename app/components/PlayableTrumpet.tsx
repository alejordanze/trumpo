import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, Wind } from "lucide-react";
import { ClientOnly } from "./ClientOnly";
import { Trumpet3D } from "./Trumpet3D";
import { ValveButtons } from "./ValveButtons";
import {
  buildScaleNotes,
  DEFAULT_OCTAVE,
  DEFAULT_SCALE,
  fingeringRows,
  MAX_OCTAVE,
  MIN_OCTAVE,
  noteForValves,
  SCALES,
  type NoteInfo,
  type Valve,
} from "~/lib/notes";
import { initAudio, startNote, stopNote } from "~/lib/audio";

export function PlayableTrumpet() {
  const [pressed, setPressed] = useState<Set<Valve>>(new Set());
  const [blowing, setBlowing] = useState(false);
  const [scaleId, setScaleId] = useState(DEFAULT_SCALE.id);
  const [octave, setOctave] = useState(DEFAULT_OCTAVE);

  const scale = useMemo(
    () => SCALES.find((s) => s.id === scaleId) ?? DEFAULT_SCALE,
    [scaleId]
  );
  const scaleNotes = useMemo(
    () => buildScaleNotes(scale, octave),
    [scale, octave]
  );

  // Mirror of pressed-valve state read by the 3D model's animation loop.
  const pressedRef = useRef<boolean[]>([false, false, false]);

  const note = noteForValves(pressed, scaleNotes);
  const currentFreq = note.freq;

  const press = useCallback((v: Valve) => {
    initAudio();
    setPressed((prev) => {
      if (prev.has(v)) return prev;
      const next = new Set(prev);
      next.add(v);
      return next;
    });
  }, []);

  const release = useCallback((v: Valve) => {
    setPressed((prev) => {
      if (!prev.has(v)) return prev;
      const next = new Set(prev);
      next.delete(v);
      return next;
    });
  }, []);

  const startBlow = useCallback(() => {
    initAudio();
    setBlowing(true);
  }, []);
  const stopBlow = useCallback(() => setBlowing(false), []);

  // Keep the 3D valves in sync with pressed state.
  useEffect(() => {
    pressedRef.current = [pressed.has(1), pressed.has(2), pressed.has(3)];
  }, [pressed]);

  // Drive the synth from the current note. Changing note/scale while sustaining
  // glides cleanly; releasing the breath stops it.
  useEffect(() => {
    if (blowing) startNote(currentFreq);
    else stopNote();
  }, [currentFreq, blowing]);

  // Stop the tone if the component unmounts mid-note.
  useEffect(() => () => stopNote(), []);

  // Global keyboard: 1/2/3 = valves, Space = blow.
  useEffect(() => {
    const isTyping = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return (
        !!el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || isTyping(e.target)) return;
      if (e.key === "1") press(1);
      else if (e.key === "2") press(2);
      else if (e.key === "3") press(3);
      else if (e.code === "Space") {
        e.preventDefault();
        startBlow();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "1") release(1);
      else if (e.key === "2") release(2);
      else if (e.key === "3") release(3);
      else if (e.code === "Space") stopBlow();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [press, release, startBlow, stopBlow]);

  return (
    <div className="player">
      <div className="player-stage">
        <ClientOnly
          fallback={<div className="canvas-fallback">Loading trumpet…</div>}
        >
          {() => <Trumpet3D pressedRef={pressedRef} interactive />}
        </ClientOnly>
      </div>

      <div className="player-side">
        {/* Scale selector */}
        <div className="scale-picker">
          <div className="picker-label">Scale</div>
          <div className="scale-chips">
            {SCALES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={"chip" + (s.id === scaleId ? " active" : "")}
                onClick={() => setScaleId(s.id)}
                title={s.name}
              >
                {s.short}
              </button>
            ))}
          </div>
          <div className="octave-row">
            <span className="picker-label">Octave</span>
            <div className="octave-ctl">
              <button
                type="button"
                className="oct-btn"
                aria-label="Octave down"
                onClick={() => setOctave((o) => Math.max(MIN_OCTAVE, o - 1))}
                disabled={octave <= MIN_OCTAVE}
              >
                <Minus size={15} />
              </button>
              <span className="oct-val">{octave}</span>
              <button
                type="button"
                className="oct-btn"
                aria-label="Octave up"
                onClick={() => setOctave((o) => Math.min(MAX_OCTAVE, o + 1))}
                disabled={octave >= MAX_OCTAVE}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className={"now-playing" + (blowing ? "" : " silent")}>
          <div className="note">{note.name}</div>
          <div className="label">
            {blowing ? "Now playing" : "Ready"} · {scale.name}
          </div>
        </div>

        <ValveButtons pressed={pressed} onDown={press} onUp={release} />

        <button
          type="button"
          className={"btn btn-primary blow-btn" + (blowing ? " active" : "")}
          onPointerDown={(e) => {
            e.preventDefault();
            startBlow();
          }}
          onPointerUp={stopBlow}
          onPointerLeave={stopBlow}
          onPointerCancel={stopBlow}
        >
          <Wind size={20} />
          {blowing ? "Blowing…" : "Hold to Blow"}
        </button>

        <p className="player-hint">
          Hold <span className="kbd">Space</span> (or the button) to blow, then
          press <span className="kbd">1</span> <span className="kbd">2</span>{" "}
          <span className="kbd">3</span> to walk the scale. Pick a scale above to
          change every note.
        </p>
      </div>
    </div>
  );
}

/** Reference of every fingering for a scale (defaults to C major). */
export function FingeringGuide({ scaleNotes }: { scaleNotes?: NoteInfo[] }) {
  const notes = scaleNotes ?? buildScaleNotes(DEFAULT_SCALE, DEFAULT_OCTAVE);
  return (
    <div
      className="card-grid"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}
    >
      {fingeringRows(notes).map(({ valves, note }) => (
        <div
          className="card"
          key={note.name + valves.join()}
          style={{ padding: 16, textAlign: "center" }}
        >
          <div
            className="gold-text"
            style={{ fontSize: "1.5rem", fontWeight: 900 }}
          >
            {note.name}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            {[1, 2, 3].map((v) => (
              <span
                key={v}
                className="kbd"
                style={{
                  opacity: valves.includes(v as Valve) ? 1 : 0.25,
                  background: valves.includes(v as Valve)
                    ? "rgba(245,197,66,0.18)"
                    : "var(--bg)",
                }}
              >
                {v}
              </span>
            ))}
          </div>
          <div
            style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: 8 }}
          >
            {valves.length === 0 ? "open" : valves.join(" + ")}
          </div>
        </div>
      ))}
    </div>
  );
}
