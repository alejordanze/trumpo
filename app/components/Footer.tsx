import { Globe, Heart, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="credit">
          Built with <span className="gold-text">passion</span> &amp; brass ·{" "}
          <b>[Dev Name]</b> 2026
        </p>
        <div className="footer-social">
          <a href="#" aria-label="Website">
            <Globe size={18} />
          </a>
          <a href="#" aria-label="Email">
            <Mail size={18} />
          </a>
          <a href="#" aria-label="Support">
            <Heart size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
