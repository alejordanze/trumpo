import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Notation = "letters" | "solfege";

const STORAGE_KEY = "trumpo-notation";

const SOLFEGE_BY_LETTER: Record<string, string> = {
  A: "La",
  B: "Si",
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
};

interface NotationContextValue {
  notation: Notation;
  setNotation: (notation: Notation) => void;
}

const NotationContext = createContext<NotationContextValue | null>(null);

export function NotationProvider({ children }: { children: ReactNode }) {
  const [notation, setNotation] = useState<Notation>("letters");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "letters" || saved === "solfege") setNotation(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, notation);
  }, [hydrated, notation]);

  return (
    <NotationContext.Provider value={{ notation, setNotation }}>
      {children}
    </NotationContext.Provider>
  );
}

export function useNotation() {
  const value = useContext(NotationContext);
  if (!value) {
    throw new Error("useNotation must be used inside a NotationProvider");
  }
  return value;
}

/** Convert a note such as C♯4 or B♭ into the selected display notation. */
export function formatNoteName(name: string, notation: Notation): string {
  if (notation === "letters") return name;

  const match = name.match(/^([A-G])([#♯b♭]?)(-?\d+)?$/);
  if (!match) return name;

  const [, letter, accidental, octave = ""] = match;
  const normalizedAccidental = accidental
    .replace("#", "♯")
    .replace("b", "♭");
  return `${SOLFEGE_BY_LETTER[letter]}${normalizedAccidental}${octave}`;
}

/** Convert a scale label such as B♭ Major or Am into the selected notation. */
export function formatScaleLabel(label: string, notation: Notation): string {
  if (notation === "letters") return label;

  const match = label.match(/^([A-G](?:[#♯b♭]?))(.*)$/);
  if (!match) return label;

  return `${formatNoteName(match[1], notation)}${match[2]}`;
}

export function NoteName({
  note,
  className,
}: {
  note: string;
  className?: string;
}) {
  const { notation } = useNotation();
  return (
    <span className={className}>{formatNoteName(note, notation)}</span>
  );
}
