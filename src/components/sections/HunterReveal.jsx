import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StatBar from "./StatBar";

const statOrder = ["physical", "stamina", "magic", "holy", "stealth"];

const statLabels = {
  physical: "Physical",
  stamina: "Stamina",
  magic: "Magic",
  holy: "Holy",
  stealth: "Stealth",
};

const ambientParticles = [
  { left: "16%", top: "70%", duration: 10.8, delay: 0 },
  { left: "28%", top: "64%", duration: 12.2, delay: 1.2 },
  { left: "38%", top: "76%", duration: 11.6, delay: 0.9 },
  { left: "50%", top: "68%", duration: 13.1, delay: 0.4 },
  { left: "61%", top: "74%", duration: 10.4, delay: 1.6 },
  { left: "72%", top: "66%", duration: 12.8, delay: 0.7 },
  { left: "81%", top: "72%", duration: 11.3, delay: 1.1 },
];

function AnimatedHunterName({ name, revealed }) {
  return (
    <h3
      className={`reveal-name ${revealed ? "reveal-name-active" : ""}`}
      aria-label={name}
    >
      {name.split("").map((letter, index) => (
        <span
          key={`${name}-${index}`}
          className="reveal-name-letter"
          style={{ "--name-char-delay": `${0.28 + index * 0.08}s` }}
        >
          {letter}
          <span className="reveal-name-spark" />
        </span>
      ))}
      <span className="reveal-name-fire-trail" aria-hidden="true" />
    </h3>
  );
}

function HunterReveal({ hunter, index }) {
  const sceneRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node || isInView) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.32 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isInView]);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <motion.article
      ref={sceneRef}
      className={`hunter-reveal-scene ${isInView ? "hunter-scene-active" : ""}`}
      initial={{ opacity: 0.2 }}
      animate={{ opacity: isInView ? 1 : 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="reveal-atmosphere" aria-hidden="true">
        <motion.div
          className="reveal-fog-layer"
          initial={{ opacity: 0.16 }}
          animate={isInView ? { opacity: [0.2, 0.35, 0.28] } : { opacity: 0.16 }}
          transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="reveal-radial-light"
          initial={{ opacity: 0 }}
          animate={
            isInView
              ? { opacity: [0.2, 0.42, 0.3], scale: [0.94, 1.04, 0.98] }
              : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 6, delay: 0.16, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />
        {ambientParticles.map((particle, particleIndex) => (
          <motion.span
            key={`${hunter.name}-particle-${particleIndex}`}
            className="reveal-particle"
            style={{ left: particle.left, top: particle.top }}
            initial={{ opacity: 0 }}
            animate={
              isInView
                ? { opacity: [0, 0.6, 0], y: [0, -36, -74], x: [0, 6, -4], scale: [0.6, 1, 0.72] }
                : { opacity: 0, y: 0, x: 0, scale: 0.6 }
            }
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <div className="reveal-vignette" />
      </div>

      <div className="reveal-layout">
        <motion.aside
          className="reveal-left"
          initial={{ opacity: 0, x: -72 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -72 }}
          transition={{ duration: 0.85, delay: 0.76, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="reveal-overline">Hunter Protocol {String(index + 1).padStart(2, "0")}</p>
          <AnimatedHunterName name={hunter.name.toUpperCase()} revealed={isInView} />
          <p className="reveal-title">{hunter.title}</p>
          <p
            className={`reveal-description reveal-attribute ${isInView ? "reveal-attribute-active" : ""}`}
            style={{ "--attribute-delay": "1.08s" }}
          >
            {hunter.description}
          </p>

          <div className="reveal-stats" role="list" aria-label={`${hunter.name} stats`}>
            {statOrder.map((key, statIndex) => (
              <StatBar
                key={key}
                label={statLabels[key]}
                value={hunter.stats[key]}
                index={statIndex}
                revealed={isInView}
                isHovered={isHovered}
              />
            ))}
          </div>
        </motion.aside>

        <motion.div
          className="reveal-center"
          aria-hidden="true"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.94 }}
          transition={{ duration: 1, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="reveal-energy-pulse"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={
              isInView
                ? { opacity: [0, 0.92, 0], scale: [0.55, 1.05, 1.32] }
                : { opacity: 0, scale: 0.55 }
            }
            transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="reveal-center-frame"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView
                ? {
                    opacity: isHovered ? [0.7, 1, 0.86] : [0.5, 0.8, 0.64],
                    scale: isHovered ? [1, 1.09, 1.03] : [0.95, 1.03, 0.98],
                  }
                : { opacity: 0, scale: 0.9 }
            }
            transition={{
              duration: isHovered ? 1.25 : 3.8,
              delay: 0.16,
              ease: "easeInOut",
              repeat: isInView ? Infinity : 0,
              repeatType: "mirror",
            }}
          />
          <motion.img
            className="reveal-portrait"
            src={hunter.image}
            alt=""
            style={{ y: portraitY }}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    filter: isHovered
                      ? "drop-shadow(0 0 36px rgba(212, 175, 55, 0.48)) drop-shadow(0 24px 42px rgba(0, 0, 0, 0.72))"
                      : "drop-shadow(0 0 14px rgba(212, 175, 55, 0.28)) drop-shadow(0 24px 42px rgba(0, 0, 0, 0.72))",
                  }
                : { opacity: 0, scale: 0.8, rotateY: 90 }
            }
            transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        <motion.aside
          className="reveal-right"
          initial={{ opacity: 0, x: 72 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 72 }}
          transition={{ duration: 0.85, delay: 1.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={`lore-block lore-glitch reveal-attribute ${isInView ? "lore-glitch-active reveal-attribute-active" : ""}`}
            style={{ "--attribute-delay": "1.34s" }}
            initial={{ opacity: 0, x: 42, filter: "blur(6px)" }}
            animate={
              isInView ? { opacity: [0, 1, 0.9, 1], x: 0, filter: "blur(0px)" } : { opacity: 0, x: 42, filter: "blur(6px)" }
            }
            transition={{ duration: 0.6, delay: 1.54, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="lore-label">Affinity</p>
            <p className="lore-value">{hunter.affinity}</p>
          </motion.div>

          <motion.div
            className={`lore-block lore-glitch reveal-attribute ${isInView ? "lore-glitch-active reveal-attribute-active" : ""}`}
            style={{ "--attribute-delay": "1.5s" }}
            initial={{ opacity: 0, x: 42, filter: "blur(6px)" }}
            animate={
              isInView ? { opacity: [0, 1, 0.88, 1], x: 0, filter: "blur(0px)" } : { opacity: 0, x: 42, filter: "blur(6px)" }
            }
            transition={{ duration: 0.6, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="lore-label">Clan</p>
            <p className="lore-value">{hunter.clan}</p>
          </motion.div>

          <motion.div
            className={`lore-block lore-notes lore-glitch reveal-attribute ${isInView ? "lore-glitch-active reveal-attribute-active" : ""}`}
            style={{ "--attribute-delay": "1.66s" }}
            initial={{ opacity: 0, x: 42, filter: "blur(6px)" }}
            animate={
              isInView ? { opacity: [0, 1, 0.86, 1], x: 0, filter: "blur(0px)" } : { opacity: 0, x: 42, filter: "blur(6px)" }
            }
            transition={{ duration: 0.7, delay: 1.86, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="lore-label">Field Notes</p>
            <p>{hunter.notes}</p>
          </motion.div>
        </motion.aside>
      </div>
    </motion.article>
  );
}

export default HunterReveal;
