import { Link } from "react-router";
import { BookOpen, Hand, Music, Piano, Wind } from "lucide-react";
import type { Route } from "./+types/home";
import { Hero } from "~/components/Hero";
import { Section } from "~/components/Section";
import { PlayableTrumpet, FingeringGuide } from "~/components/PlayableTrumpet";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TrumpetTrainer — Learn to play the trumpet" },
    {
      name: "description",
      content:
        "An interactive, animated playground and step-by-step course for learning the trumpet from scratch.",
    },
  ];
}

const FEATURES = [
  {
    icon: <Wind size={22} />,
    title: "Play in your browser",
    text: "A synthesized trumpet you control with on-screen valves or the 1, 2 and 3 keys — no instrument required.",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Step-by-step lessons",
    text: "From how to hold the trumpet to your first clear note, each lesson builds on the last.",
  },
  {
    icon: <Piano size={22} />,
    title: "Fingering guide",
    text: "See exactly which valves make each note, then hear it instantly on the interactive trumpet.",
  },
];

export default function Home() {
  return (
    <main>
      <Hero />

      {/* What is a trumpet */}
      <Section className="section" id="about">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">
              <Music size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
              What is a trumpet?
            </span>
            <h2>
              A <span className="gold-text">brass voice</span> powered by your
              breath.
            </h2>
            <p>
              The trumpet is a brass instrument with the highest register in its
              family. You make sound by buzzing your lips into a cup-shaped
              mouthpiece, and just <strong>three valves</strong> reroute the air
              through extra tubing to reach every note. Small changes in your
              lips and air do the rest — which is exactly what you'll practice
              here.
            </p>
          </div>
        </div>
      </Section>

      {/* What you'll find */}
      <Section className="section-tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What you'll find here</span>
            <h2>Everything to get your first notes out.</h2>
          </div>
          <div className="card-grid">
            {FEATURES.map((f) => (
              <div className="card" key={f.title}>
                <div className="card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Play it */}
      <Section className="section" id="play">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">
              <Hand size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
              Try it now
            </span>
            <h2>
              Play the <span className="gold-text">trumpet</span>.
            </h2>
            <p>
              Hold the blow button (or the spacebar) and press the valves to
              walk up and down the scale. Pick a scale — natural C, G, F, B♭,
              minors and more — or shift the octave to unlock a whole new set of
              notes.
            </p>
          </div>
          <PlayableTrumpet />

          <div style={{ marginTop: 48 }}>
            <div className="section-head" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.5rem" }}>Fingering guide</h2>
            </div>
            <FingeringGuide />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="section-tight">
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "48px 28px",
              background:
                "radial-gradient(600px 300px at 50% 0%, rgba(245,197,66,0.12), transparent 70%), linear-gradient(180deg, var(--bg-card), var(--bg-elev))",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: 12 }}>
              Ready to make your <span className="gold-text">first sound?</span>
            </h2>
            <p style={{ color: "var(--muted)", marginBottom: 24 }}>
              The lessons walk you through it, one step at a time.
            </p>
            <Link to="/lessons" className="btn btn-primary">
              Open the lessons
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
