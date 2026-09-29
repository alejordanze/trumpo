# Trumpo

Trumpo is an interactive introduction to the trumpet. It is a project
about sharing my passion for the instrument and making the first steps feel
more approachable: anyone can learn a little about how the trumpet works,
practice basic fingerings, and make a few notes directly in the browser.

## What you can do

- Explore an interactive 3D trumpet.
- Play synthesized notes with the on-screen valves or the `1`, `2`, and `3`
  keys.
- Hold the blow control (or the spacebar) to sustain a note and hear the
  fingering change as you play.
- Choose from several scales and move between octaves.
- Switch note names between letter notation (\`C D E\`) and solfège
  (\`Do Re Mi\`).
- Follow lessons covering the trumpet’s parts, posture, mouthpiece,
  embouchure, breathing, care, first notes, tonguing, rhythm, and practice
  habits.
- Use the fingering guide to connect each note with its valve combination.

The browser instrument is a practice and learning aid, not a replacement for
playing a real trumpet. The goal is to make music education more inviting and
give beginners a friendly place to start.

## Run the project locally

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

Clone the repository, move into the project directory, and install the
dependencies:

```bash
git clone <repository-url>
cd trumpo
npm install
```

### Development server

Start the local development server with hot module replacement:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Audio is
enabled after the first interaction with the playable trumpet, as required by
modern browsers.

### Production build

Create and serve a production build locally:

```bash
npm run build
npm run start
```

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Build the application for production. |
| `npm run start` | Serve the production build. |
| `npm run typecheck` | Generate React Router types and run TypeScript checks. |

## Technologies

- **React 19** for the component-based user interface.
- **React Router 7** for routing and server-side rendering.
- **TypeScript** for typed application code.
- **Vite** for development and bundling.
- **Tailwind CSS 4** alongside custom CSS for styling and design tokens.
- **Three.js**, **React Three Fiber**, and **Drei** for the interactive 3D
  trumpet and scene effects.
- **Web Audio API** for the browser-based synthesized trumpet sound.
- **Framer Motion** for lesson-page animations.
- **Lucide React** for interface icons.

## Project structure

```text
app/
├── components/   # Shared UI, notation controls, and trumpet components
├── lib/          # Audio, musical note/fingering data, and notation state
├── routes/       # Home page and lesson content
├── app.css       # Global styles and design tokens
└── root.tsx      # Application shell and document layout
```

## Contributing

Suggestions, corrections, and improvements to the learning experience are
welcome. If you find an issue or have an idea that could help someone learn
the trumpet more easily, please open an issue or submit a pull request.

## License

No license has been selected for this project yet.
