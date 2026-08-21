// Trumpet fingering → note mapping, with selectable musical scales.
//
// This models a B♭ trumpet. The eight valve combinations map to the eight
// ascending degrees of a chosen scale (do → do an octave up), using the real
// B♭ trumpet fingerings for the C major scale wherever a unique combination
// exists:
//
//   C = open   D = 1+3   E = 1+2   F = 1   G = 3   A = 2+3   B = 2   C = 1+2+3
//
// (On a real trumpet G, the upper A and the octave C reuse open/1+2 with a
// different lip partial; since we can't detect the lips, those three get the
// remaining unique combinations so the whole scale stays playable.)
//
// Selecting a different scale — or shifting the octave — re-maps the same
// buttons to that scale's notes, keeping 1+3 on the 2nd degree, etc.

export type Valve = 1 | 2 | 3;

export interface NoteInfo {
  /** Display name, e.g. "C4" */
  name: string;
  /** Frequency in Hz */
  freq: number;
}

const NOTE_NAMES = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
];

/** Standard equal-tempered frequency of a MIDI note number (A4 = 69 = 440Hz). */
function midiToFreq(m: number): number {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function midiToName(m: number): string {
  const name = NOTE_NAMES[((m % 12) + 12) % 12];
  const octave = Math.floor(m / 12) - 1;
  return `${name}${octave}`;
}

// Valve combination for each ascending scale degree (do … do'), using real B♭
// trumpet C-major fingerings. Keys are the sorted valve set joined with "-".
//   degree:  do   re    mi    fa   sol  la    ti   do'
//   note(C): C    D     E     F    G    A     B    C
const COMBO_ORDER = [
  "", // C   open
  "1-3", // D   1+3
  "1-2", // E   1+2
  "1", // F   1
  "3", // G   3
  "2-3", // A   2+3
  "2", // B   2
  "1-2-3", // C'  1+2+3
];

// Scale-degree semitone offsets from the tonic, across one octave (8 notes).
const MAJOR = [0, 2, 4, 5, 7, 9, 11, 12];
const NATURAL_MINOR = [0, 2, 3, 5, 7, 8, 10, 12];

export interface Scale {
  id: string;
  name: string;
  short: string;
  /** Pitch class of the tonic (0 = C, 1 = C♯, … 11 = B). */
  pc: number;
  pattern: number[];
}

export const SCALES: Scale[] = [
  { id: "c-major", name: "C Major (natural)", short: "C", pc: 0, pattern: MAJOR },
  { id: "g-major", name: "G Major", short: "G", pc: 7, pattern: MAJOR },
  { id: "f-major", name: "F Major", short: "F", pc: 5, pattern: MAJOR },
  { id: "bb-major", name: "B♭ Major", short: "B♭", pc: 10, pattern: MAJOR },
  { id: "d-major", name: "D Major", short: "D", pc: 2, pattern: MAJOR },
  { id: "a-minor", name: "A Minor", short: "Am", pc: 9, pattern: NATURAL_MINOR },
  { id: "d-minor", name: "D Minor", short: "Dm", pc: 2, pattern: NATURAL_MINOR },
];

export const DEFAULT_SCALE = SCALES[0];
/** Octave the tonic sits in by default (e.g. 3 → base note C3). */
export const DEFAULT_OCTAVE = 3;
export const MIN_OCTAVE = 2;
export const MAX_OCTAVE = 5;

/** The eight ascending notes of a scale with its tonic in the given octave. */
export function buildScaleNotes(
  scale: Scale,
  octave: number = DEFAULT_OCTAVE
): NoteInfo[] {
  const rootMidi = 12 * (octave + 1) + scale.pc; // MIDI: C(-1)=0, so C3 = 48
  return scale.pattern.map((semi) => {
    const m = rootMidi + semi;
    return { name: midiToName(m), freq: midiToFreq(m) };
  });
}

/** Sorted "1-2-3"-style key for a set of pressed valves. */
export function comboKey(valves: Set<Valve>): string {
  return [1, 2, 3].filter((v) => valves.has(v as Valve)).join("-");
}

/** Map pressed valves to a note, given the active scale's eight notes. */
export function noteForValves(valves: Set<Valve>, scaleNotes: NoteInfo[]): NoteInfo {
  const idx = COMBO_ORDER.indexOf(comboKey(valves));
  return scaleNotes[idx >= 0 ? idx : scaleNotes.length - 1];
}

/** Rows for the fingering guide: each combo with the note it plays. */
export function fingeringRows(
  scaleNotes: NoteInfo[]
): { valves: Valve[]; note: NoteInfo }[] {
  return COMBO_ORDER.map((key, i) => ({
    valves: key ? (key.split("-").map(Number) as Valve[]) : [],
    note: scaleNotes[i],
  }));
}
