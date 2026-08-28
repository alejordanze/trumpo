import { Link } from "react-router";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ClientOnly } from "./ClientOnly";
import { Trumpet3D } from "./Trumpet3D";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Hero() {
  return (
    <div className="container">
      <div className="hero">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span className="eyebrow" variants={item}>
            <Sparkles size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            Learn brass from scratch
          </motion.span>
          <motion.h1 variants={item}>
            Master the <span className="gold-text">Trumpet</span>
          </motion.h1>
          <motion.p className="lead" variants={item}>
            An interactive playground to discover how the trumpet works — buzz,
            valves and all. Play real notes right in your browser, then follow
            step-by-step lessons from your very first sound.
          </motion.p>
          <motion.div className="hero-cta" variants={item}>
            <Link to="/lessons" className="btn btn-primary">
              Start learning <ArrowRight size={18} />
            </Link>
            <a href="#play" className="btn btn-ghost">
              Try the trumpet
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-canvas"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" as const, delay: 0.2 }}
        >
          <ClientOnly
            fallback={<div className="canvas-fallback">🎺</div>}
          >
            {() => <Trumpet3D autoRotate />}
          </ClientOnly>
        </motion.div>
      </div>
    </div>
  );
}
