import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const LEFT_STATS = [
  { key: "stealth", label: "Stealth" },
  { key: "holy", label: "Holy" },
];

const RIGHT_STATS = [
  { key: "physical", label: "Physical" },
  { key: "stamina", label: "Stamina" },
  { key: "magic", label: "Magic" },
];

const nameLetterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      delay: 0.4 + index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const nameSparkVariants = {
  hidden: { opacity: 0, scale: 0.45, y: 0, x: 0 },
  visible: (index) => ({
    opacity: [0, 1, 0],
    scale: [0.45, 1.05, 0.35],
    y: [0, -8, -16],
    x: [0, 2, -1],
    transition: {
      duration: 0.55,
      delay: 0.44 + index * 0.07,
      ease: "easeOut",
    },
  }),
};

const statRevealVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.62,
      delay: 0.6 + index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function createSeededRandom(seed) {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) {
    state = (state << 5) - state + seed.charCodeAt(i);
    state |= 0;
  }

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function buildAtmosphereParticles(seed) {
  const random = createSeededRandom(seed);

  return Array.from({ length: 10 }, (_, index) => ({
    id: `${seed}-${index}`,
    left: `${(random() * 100).toFixed(2)}%`,
    delay: `${(-random() * 16).toFixed(2)}s`,
    duration: `${(16 + random() * 14).toFixed(2)}s`,
    drift: `${(-14 + random() * 28).toFixed(2)}px`,
    size: `${(1.1 + random() * 1.7).toFixed(2)}px`,
  }));
}

function HunterName({ name, shouldReveal }) {
  const letters = name.toUpperCase().split("");

  return (
    <div className="hunter-cinematic-name" aria-label={name}>
      {letters.map((char, index) => (
        <span key={`${name}-${char}-${index}`} className="hunter-name-char-wrap">
          <motion.span
            className="hunter-name-letter"
            variants={nameLetterVariants}
            initial="hidden"
            animate={shouldReveal ? "visible" : "hidden"}
            custom={index}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
          <motion.span
            className="hunter-name-spark"
            aria-hidden="true"
            variants={nameSparkVariants}
            initial="hidden"
            animate={shouldReveal ? "visible" : "hidden"}
            custom={index}
          />
        </span>
      ))}
    </div>
  );
}

function ChapterStat({ slot, value, index, side, shouldReveal }) {
  return (
    <motion.div
      className={`chapter-stat chapter-stat-${side}`}
      variants={statRevealVariants}
      initial="hidden"
      animate={shouldReveal ? "visible" : "hidden"}
      custom={index}
    >
      {side === "right" && (
        <span className="chapter-stat-line-shell">
          <motion.span
            className="chapter-stat-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={shouldReveal ? { scaleX: 1, opacity: 0.92 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.48, delay: 0.52 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      )}

      <div className="chapter-stat-core">
        <div className="chapter-stat-head">
          <span>{slot.label}</span>
          <span>{value}</span>
        </div>
        <div className="chapter-stat-track">
          <motion.span
            className="chapter-stat-fill"
            initial={{ width: 0 }}
            animate={shouldReveal ? { width: `${value}%` } : { width: 0 }}
            transition={{ duration: 0.78, delay: 0.68 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {side === "left" && (
        <span className="chapter-stat-line-shell">
          <motion.span
            className="chapter-stat-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={shouldReveal ? { scaleX: 1, opacity: 0.92 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.48, delay: 0.52 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      )}
    </motion.div>
  );
}

function HunterShowcase({ hunter, index, onActivate, activeIndex }) {
  const blockRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const isInView = useInView(blockRef, {
    amount: 0.12,
    margin: "0px 0px -20% 0px",
  });

  useEffect(() => {
    if (isInView) {
      setHasEntered(true);
      if (onActivate) {
        onActivate(index);
      }
    }
  }, [isInView, index, onActivate]);

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const particles = useMemo(() => buildAtmosphereParticles(hunter.name), [hunter.name]);

  const isPast = activeIndex > index;
  const isActive = activeIndex === index;
  const shouldReveal = isInView || hasEntered || isActive;
  const chapterLabel = `Hunter Protocol ${String(index + 1).padStart(2, "0")}`;

  return (
    <motion.article
      ref={blockRef}
      className={`hunter-block${isPast ? " is-past" : ""}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-450px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={`hunter-showcase-stage${isHovered ? " is-hovered" : ""}`}
        animate={isPast ? { opacity: 0.6, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: parallaxY }}
      >
        <div className="hunter-stage-atmosphere" aria-hidden="true">
          <motion.div
            className="hunter-stage-fog hunter-stage-fog-deep"
            initial={{ opacity: 0 }}
            animate={shouldReveal ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="hunter-stage-fog hunter-stage-fog-front"
            initial={{ opacity: 0 }}
            animate={shouldReveal ? { opacity: 0.95 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="hunter-stage-vignette"
            initial={{ opacity: 0.5 }}
            animate={shouldReveal ? { opacity: 1 } : { opacity: 0.5 }}
            transition={{ duration: 0.7 }}
          />
        </div>

        <div className="hunter-stage-particles" aria-hidden="true">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="hunter-atmo-particle"
              style={{
                "--left": particle.left,
                "--delay": particle.delay,
                "--duration": particle.duration,
                "--drift": particle.drift,
                "--size": particle.size,
              }}
            />
          ))}
        </div>

        <div className="hunter-stage-content">
          <motion.p
            className="hunter-scene-label"
            initial={{ opacity: 0, y: 12 }}
            animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {chapterLabel}
          </motion.p>

          <div className="hunter-stage-header">
            <HunterName name={hunter.name} shouldReveal={shouldReveal} />
            <motion.p
              className="hunter-stage-title"
              initial={{ opacity: 0, y: 14 }}
              animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.55, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              {hunter.title}
            </motion.p>
          </div>

          <div className="hunter-stage-grid">
            <motion.aside
              className="hunter-stage-column hunter-stage-left"
              initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
              animate={shouldReveal ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: -30, filter: "blur(6px)" }}
              transition={{ duration: 0.68, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="hunter-brief-block"
                initial={{ opacity: 0, y: 14 }}
                animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.62, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="hunter-lore-label">Scout Brief</p>
                <p className="hunter-lore-text">{hunter.summary}</p>
              </motion.div>
              <div className="hunter-stat-stack" role="list" aria-label={`${hunter.name} left stats`}>
                {LEFT_STATS.map((slot, statIndex) => (
                  <ChapterStat
                    key={`${hunter.name}-${slot.key}`}
                    slot={slot}
                    side="left"
                    value={hunter.stats[slot.key]}
                    index={statIndex}
                    shouldReveal={shouldReveal}
                  />
                ))}
              </div>
            </motion.aside>

            <div className="hunter-stage-center">
              <motion.div
                className={`hunter-character-stage${isHovered ? " is-hovered" : ""}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={shouldReveal ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.95, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.div
                  className="hunter-stage-gold-glow"
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={shouldReveal ? { opacity: isHovered ? 1 : 0.82, scale: isHovered ? 1.08 : 1 } : { opacity: 0, scale: 0.82 }}
                  transition={{ duration: 0.72, delay: 0.14 }}
                />
                <div className="hunter-stage-ground-fog" aria-hidden="true" />
                <motion.img
                  src={hunter.imagePath}
                  alt={hunter.name}
                  className="hunter-image"
                  loading="eager"
                  decoding="sync"
                  initial={{ opacity: 0, y: 22, scale: 0.92 }}
                  animate={shouldReveal ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 22, scale: 0.92 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </div>

            <motion.aside
              className="hunter-stage-column hunter-stage-right"
              initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
              animate={shouldReveal ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: 30, filter: "blur(6px)" }}
              transition={{ duration: 0.7, delay: 0.94, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hunter-stat-stack" role="list" aria-label={`${hunter.name} right stats`}>
                {RIGHT_STATS.map((slot, statIndex) => (
                  <ChapterStat
                    key={`${hunter.name}-${slot.key}`}
                    slot={slot}
                    side="right"
                    value={hunter.stats[slot.key]}
                    index={statIndex + LEFT_STATS.length}
                    shouldReveal={shouldReveal}
                  />
                ))}
              </div>
              <motion.div
                className="hunter-notes-block"
                initial={{ opacity: 0, y: 14 }}
                animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.62, delay: 1.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="hunter-lore-label">Field Notes</p>
                <p className="hunter-lore-text">{hunter.notes}</p>
              </motion.div>
            </motion.aside>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default HunterShowcase;
