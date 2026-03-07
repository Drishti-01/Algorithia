import { useRef } from "react";
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

function HunterReveal({ hunter, index }) {
  const sceneRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 1.02]);

  return (
    <motion.article
      ref={sceneRef}
      className="hunter-reveal-scene"
      initial={{ opacity: 0.2 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="reveal-atmosphere" aria-hidden="true">
        <div className="reveal-fog-layer" />
        <div className="reveal-radial-light" />
        <div className="reveal-vignette" />
      </div>

      <div className="reveal-layout">
        <motion.aside
          className="reveal-left"
          initial={{ opacity: 0, x: -72 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="reveal-overline">Hunter Protocol {String(index + 1).padStart(2, "0")}</p>
          <h3 className="reveal-name">{hunter.name}</h3>
          <p className="reveal-title">{hunter.title}</p>
          <p className="reveal-description">{hunter.description}</p>

          <div className="reveal-stats" role="list" aria-label={`${hunter.name} stats`}>
            {statOrder.map((key, statIndex) => (
              <StatBar
                key={key}
                label={statLabels[key]}
                value={hunter.stats[key]}
                index={statIndex}
              />
            ))}
          </div>
        </motion.aside>

        <motion.div
          className="reveal-center"
          aria-hidden="true"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="reveal-center-frame" />
          <motion.img
            className="reveal-portrait"
            src={hunter.image}
            alt=""
            style={{ y: portraitY, scale: portraitScale }}
          />
        </motion.div>

        <motion.aside
          className="reveal-right"
          initial={{ opacity: 0, x: 72 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="lore-block">
            <p className="lore-label">Affinity</p>
            <p className="lore-value">{hunter.affinity}</p>
          </div>

          <div className="lore-block">
            <p className="lore-label">Clan</p>
            <p className="lore-value">{hunter.clan}</p>
          </div>

          <div className="lore-block lore-notes">
            <p className="lore-label">Field Notes</p>
            <p>{hunter.notes}</p>
          </div>
        </motion.aside>
      </div>
    </motion.article>
  );
}

export default HunterReveal;
