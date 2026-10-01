import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import type { Route } from "./+types/lessons";
import { TrumpetParts } from "~/components/TrumpetParts";
import { EmbouchureDiagram, AirPathDiagram } from "~/components/LessonArt";
import { ClientOnly } from "~/components/ClientOnly";
import { Trumpet3D } from "~/components/Trumpet3D";
import { LESSON_IDS } from "~/lib/lessonIds";
import { NoteName } from "~/lib/notation";
import { pageMeta, SITE_NAME } from "~/lib/seo";

export function meta({ params }: Route.MetaArgs) {
  const lesson = LESSONS.find((item) => item.id === params.lessonId);

  if (lesson) {
    return pageMeta({
      title: `${lesson.title} — ${SITE_NAME}`,
      description: lesson.description,
      path: `/lessons/${lesson.id}`,
    });
  }

  if (params.lessonId) {
    return pageMeta({
      title: `Lesson not found — ${SITE_NAME}`,
      description: "That lesson could not be found. Browse all Trumpo lessons.",
      path: "/lessons",
      noindex: true,
    });
  }

  return pageMeta({
    title: `Trumpet lessons — ${SITE_NAME}`,
    description:
      "Learn the trumpet step by step with Trumpo's beginner lessons on parts, care, breathing, fingerings, and practice.",
    path: "/lessons",
  });
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  body: React.ReactNode;
}

const LESSONS: Lesson[] = [
  {
    id: LESSON_IDS.requirements,
    title: "What you'll need",
    description:
      "Find out what you need to start learning the trumpet, from a mouthpiece and valve oil to a steady practice routine.",
    body: (
      <>
        <p>
          You don't need much to begin — just a few essentials and a little
          patience. Progress on the trumpet comes from short, regular practice.
        </p>
        <ul>
          <li>
            <strong>
              A <NoteName note="B♭" /> trumpet
            </strong>{" "}
            with a matching mouthpiece (a 7C is a great, common starter size).
          </li>
          <li>
            <strong>Valve oil</strong> to keep the valves moving freely, plus a
            soft cloth.
          </li>
          <li>
            <strong>A music stand and mirror</strong> — the mirror lets you
            check your lips and posture.
          </li>
          <li>
            <strong>Steady air and patience.</strong> Your first goal is a
            clear buzz, not a song.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: LESSON_IDS.parts,
    title: "Parts of the trumpet",
    description:
      "Explore the parts of a trumpet with an interactive 3D model and learn what each piece does.",
    body: (
      <>
        <p>
          Knowing the pieces makes every later instruction click. Hover a{" "}
          <strong>number on the diagram</strong> — or any card below — to see
          what each part is called and where it sits.
        </p>
        <div className="lesson-trumpet-preview">
          <ClientOnly fallback={<div className="canvas-fallback">Loading trumpet…</div>}>
            {() => <Trumpet3D autoRotate interactive />}
          </ClientOnly>
          <p className="lesson-figure-caption">
            Drag to rotate the model and recognize the same parts in a real instrument.
          </p>
        </div>
        <TrumpetParts />
      </>
    ),
  },
  {
    id: LESSON_IDS.care,
    title: "Care, cleaning & valve oil",
    description:
      "Learn simple ways to clean your trumpet, oil its valves, and keep it ready to play.",
    body: (
      <>
        <p>
          A clean, well-oiled trumpet responds more easily and lasts longer.
          Build these small habits into every practice session.
        </p>
        <ul>
          <li>
            <strong>Before playing:</strong> push the mouthpiece in gently with
            a small twist — never force it or tap it into place.
          </li>
          <li>
            <strong>Oil the valves:</strong> remove one valve at a time, add a
            few drops to the smooth valve surface, and guide it straight back
            into its matching casing.
          </li>
          <li>
            <strong>Empty condensation:</strong> open the water keys over a
            cloth and blow gently through the instrument when you finish.
          </li>
          <li>
            <strong>After practice:</strong> wipe fingerprints from the
            outside and store the trumpet in its case. Give it a proper
            lukewarm-water cleaning regularly.
          </li>
        </ul>
        <p>
          If a mouthpiece or valve is stuck, stop and ask a teacher or repair
          technician for help — tools and force can damage the instrument.
        </p>
      </>
    ),
  },
  {
    id: LESSON_IDS.hold,
    title: "How to hold the trumpet",
    description:
      "Get comfortable with trumpet posture, hand placement, and how to hold your instrument.",
    body: (
      <>
        <p>
          Good grip keeps you relaxed and your fingers free to move quickly.
        </p>
        <ul>
          <li>
            <strong>Left hand</strong> does the holding: wrap it around the
            valve casings so the instrument's weight rests there. Your thumb and
            fingers may reach the tuning-slide rings.
          </li>
          <li>
            <strong>Right hand</strong> plays: place the fingertips (not the
            flat pads) of your index, middle and ring fingers on valves{" "}
            <strong>1, 2 and 3</strong>. Curve the fingers naturally.
          </li>
          <li>
            Rest your right-hand <strong>pinky lightly</strong> near the finger
            hook — don't anchor it hard, or your fingers stiffen.
          </li>
          <li>
            Sit or stand tall, shoulders relaxed, bell angled slightly down and
            out.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: LESSON_IDS.mouthpiece,
    title: "The mouthpiece & embouchure",
    description:
      "Learn how the mouthpiece and embouchure work, and try your first steady buzz.",
    body: (
      <>
        <p>
          Sound starts at your lips — the mouthpiece just focuses the buzz. This
          lip shape is called your <strong>embouchure</strong>.
        </p>
        <ul>
          <li>
            Bring your lips together as if saying <strong>“M”</strong>, keeping
            the corners firm and the center relaxed.
          </li>
          <li>
            Blow a steady stream of air so the lips <strong>buzz</strong> — like
            a gentle raspberry. Practice this on the mouthpiece alone first.
          </li>
          <li>
            Center the mouthpiece roughly <strong>half on the top lip, half on
            the bottom</strong>, and press only lightly.
          </li>
          <li>
            Higher notes come from firmer corners and faster air; lower notes
            from a more open, relaxed aperture — never from pressing harder.
          </li>
        </ul>
        <EmbouchureDiagram />
      </>
    ),
  },
  {
    id: LESSON_IDS.breathing,
    title: "Breathing & air support",
    description:
      "Build steady airflow with simple breathing exercises for your first trumpet notes.",
    body: (
      <>
        <p>
          The trumpet is a wind instrument — your air is the engine. Full,
          relaxed breaths give you a steady, ringing tone.
        </p>
        <ul>
          <li>
            Breathe in <strong>from the belly</strong>, not the shoulders — let
            your waist expand.
          </li>
          <li>
            Blow a <strong>warm, continuous stream</strong>, as if fogging a
            mirror, keeping the air moving through phrases.
          </li>
          <li>
            Support from your core so the sound stays steady from start to
            finish.
          </li>
        </ul>
        <AirPathDiagram />
      </>
    ),
  },
  {
    id: LESSON_IDS.firstNote,
    title: "Your first note & fingerings",
    description:
      "Play your first trumpet note and learn how valve combinations make different pitches.",
    body: (
      <>
        <p>
          Put it together: take a full breath, form your “M” embouchure, and
          buzz a steady tone into the trumpet with the valves up. That open note
          is your <strong><NoteName note="C" /></strong>. Congratulations — you're playing!
        </p>
        <p>
          From there, the valves walk you up the scale. On a{" "}
          <NoteName note="B♭" /> trumpet the{" "}
          <NoteName note="C" />{" "}
          major scale uses these real fingerings. Keep your air supported and
          adjust its speed and your embouchure to move between notes that share
          the same fingering:
        </p>
        <ul>
          <li>
            <strong><NoteName note="C" /></strong>: open · <strong><NoteName note="D" /></strong>: 1 + 3 ·{" "}
            <strong><NoteName note="E" /></strong>: 1 + 2 · <strong><NoteName note="F" /></strong>: 1
          </li>
          <li>
            <strong><NoteName note="G" /></strong>: open · <strong><NoteName note="A" /></strong>: 1 + 2 ·{" "}
            <strong><NoteName note="B" /></strong>: 2 · <strong><NoteName note="C" /></strong>: open
          </li>
        </ul>
        <p>
          Open fingering can produce <strong><NoteName note="C" /></strong>,{" "}
          <strong><NoteName note="G" /></strong>, and the next{" "}
          <strong><NoteName note="C" /></strong> because your lips and air select
          different notes from the trumpet's harmonic series.
        </p>
        <p>
          Head back to the{" "}
          <Link to="/#play" style={{ color: "var(--gold-bright)", fontWeight: 600 }}>
            interactive trumpet
          </Link>{" "}
          to hear the pitches and train with the 1, 2 and 3 keys. Its controls
          intentionally use one unique combination per note because a browser
          cannot detect changes in your lips or air.
        </p>
      </>
    ),
  },
  {
    id: LESSON_IDS.tonguing,
    title: "Tonguing, rhythm & tuning",
    description:
      "Practice clean note starts, rhythm, and tuning with simple trumpet exercises.",
    body: (
      <>
        <p>
          Once your air and buzz are working, your tongue starts and separates
          notes. It should shape the air, not stop it in your throat.
        </p>
        <ul>
          <li>
            <strong>Start a note:</strong> whisper “too” or “doo” while the air
            is already moving. Let the tongue touch just behind the top teeth,
            then release it.
          </li>
          <li>
            <strong>Keep the air continuous:</strong> practice four even notes
            on one pitch, then four notes with the valves changing. The tongue
            moves; the breath stays steady.
          </li>
          <li>
            <strong>Build rhythm:</strong> set a slow metronome, count
            “1-and-2-and,” and play one note on each count before adding
            fingerings.
          </li>
          <li>
            <strong>Listen and tune:</strong> use a tuner occasionally, but
            trust your ears too. A steady tone, relaxed embouchure, and gentle
            air support matter more than chasing every cent.
          </li>
        </ul>
        <p>
          Start with a comfortable middle register. Range comes gradually from
          efficient air and consistent practice, never from squeezing the lips.
        </p>
      </>
    ),
  },
  {
    id: LESSON_IDS.practice,
    title: "Practice tips & next steps",
    description:
      "Put your new skills into a short practice routine and plan what to learn next.",
    body: (
      <>
        <ul>
          <li>
            <strong>Little and often.</strong> 15 focused minutes a day beats
            one long weekly session.
          </li>
          <li>
            <strong>Long tones</strong> build endurance and a beautiful sound —
            hold each note as steadily as you can.
          </li>
          <li>
            <strong>Rest as much as you play.</strong> Your lip muscles are
            small; give them breaks.
          </li>
          <li>
            <strong>Play music you enjoy.</strong> Simple melodies keep you
            motivated far more than drills alone.
          </li>
        </ul>
      </>
    ),
  },
];

export default function Lessons() {
  const { lessonId } = useParams();
  const lessonIndex = LESSONS.findIndex((lesson) => lesson.id === lessonId);

  if (lessonId && lessonIndex < 0) {
    return (
      <main className="container lesson-not-found">
        <span className="eyebrow">The course</span>
        <h1>Lesson not found</h1>
        <p>That lesson link may be out of date.</p>
        <Link to="/lessons" className="btn btn-primary">
          Browse all lessons
        </Link>
      </main>
    );
  }

  if (lessonId) {
    const lesson = LESSONS[lessonIndex];
    const previousLesson = LESSONS[lessonIndex - 1];
    const nextLesson = LESSONS[lessonIndex + 1];

    return (
      <main className="container lesson-page">
        <div className="lesson-page-inner">
          <Link to="/lessons" className="lesson-back-link">
            ← All lessons
          </Link>
          <header className="lesson-page-heading">
            <span className="eyebrow">
              Lesson {lessonIndex + 1} of {LESSONS.length}
            </span>
            <h1>{lesson.title}</h1>
          </header>
          <motion.article
            className="lesson lesson-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
          >
            {lesson.body}
          </motion.article>
          <nav className="lesson-pagination" aria-label="Lesson navigation">
            {previousLesson ? (
              <Link
                to={`/lessons/${previousLesson.id}`}
                className="lesson-pagination-link previous"
              >
                <span>← Previous</span>
                <strong>{previousLesson.title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {nextLesson ? (
              <Link
                to={`/lessons/${nextLesson.id}`}
                className="lesson-pagination-link next"
              >
                <span>Next →</span>
                <strong>{nextLesson.title}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="lesson-hero">
          <span className="eyebrow">The course</span>
          <h1>
            Learn the trumpet, <span className="gold-text">from scratch</span>.
          </h1>
          <p>
            No experience needed. Work through these steps in order — by the end
            you'll be producing your first clear notes and know exactly how the
            trumpet makes sound.
          </p>
        </div>

        <ol className="lesson-index-list">
          {LESSONS.map((lesson, i) => (
            <li key={lesson.id}>
              <Link
                to={`/lessons/${lesson.id}`}
                className="lesson-index-link"
              >
                <span className="lesson-index-number" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="lesson-index-title">{lesson.title}</span>
                <span className="lesson-index-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
