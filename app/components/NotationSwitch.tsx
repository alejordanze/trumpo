import { useNotation, type Notation } from "~/lib/notation";

const OPTIONS: { value: Notation; label: string; title: string }[] = [
  { value: "letters", label: "C D E", title: "Letter names" },
  { value: "solfege", label: "Do Re Mi", title: "Solfège names" },
];

export function NotationSwitch() {
  const { notation, setNotation } = useNotation();

  return (
    <div className="notation-switch" role="group" aria-label="Music notation">
      <span className="notation-label">Notation</span>
      <div className="notation-options">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={notation === option.value ? "active" : ""}
            aria-pressed={notation === option.value}
            title={option.title}
            onClick={() => setNotation(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
