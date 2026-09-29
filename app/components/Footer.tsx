import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="credit">
          Made with <Heart
            size={14}
            fill="currentColor"
            aria-label="love"
            style={{ verticalAlign: "-2px", margin: "0 3px" }}
          /> by{" "}
          <a
            href="https://alejordan.com"
            target="_blank"
            rel="noreferrer"
          >
            <b>Alejandro Jordan</b>
          </a>
        </p>
        <div className="footer-social">
          <a
            href="https://github.com/alejordanze"
            aria-label="Alejandro Jordan on GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.3-1.68-1.3-1.68-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.8 2.75 1.28 3.42.98.1-.76.41-1.28.75-1.58-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.5 3.2-1.18 3.2-1.18.64 1.6.24 2.77.12 3.06.75.81 1.2 1.84 1.2 3.1 0 4.43-2.71 5.4-5.29 5.69.42.36.8 1.06.8 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
