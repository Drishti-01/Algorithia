import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HunterShowcase from "./HunterShowcase";

const hunters = [
  {
    name: "Vexara",
    title: "Shadow Arcanist",
    imagePath: "/hunters/vexara.png",
    summary:
      "Moonbound sigils carve hidden routes through collapsing lanes. Vexara turns every failed branch into a lethal feint.",
    affinity: "Arcane Stealth",
    clan: "Night Thread Accord",
    description:
      "A moonbound caster weaving recursive sigils through silent alleys. She bends unstable data paths into precise shadow routes.",
    notes:
      "Vexara marks dead branches and stores each failed route as an illusion. In endgame phases she replays the strongest discarded path as a critical burst.",
    stats: {
      physical: 42,
      stamina: 61,
      magic: 94,
      holy: 58,
      stealth: 97,
    },
  },
  {
    name: "Kael",
    title: "Blade of Queues",
    imagePath: "/hunters/kael.png",
    summary:
      "Kael anchors the front line with relentless tempo control. Pressure enters first and leaves as synchronized retaliation.",
    affinity: "Tempo Control",
    clan: "First-In Legion",
    description:
      "A frontline tactician who fights in strict order. Kael absorbs pressure at the point of impact and turns overflow into momentum.",
    notes:
      "When queues flood, Kael redirects enemy aggression into reserve channels, then unloads compressed force in synchronized retaliatory strikes.",
    stats: {
      physical: 90,
      stamina: 84,
      magic: 46,
      holy: 39,
      stealth: 62,
    },
  },
  {
    name: "Elderoot",
    title: "Warden of Trees",
    imagePath: "/hunters/arbor.png",
    summary:
      "Elderoot redirects battle flow through living branch logic. Unstable encounters are pruned before they can cascade.",
    affinity: "Adaptive Growth",
    clan: "Rootline Circle",
    description:
      "A towering spirit guardian that grows strategic branches in battle, routing allies toward survivable outcomes while pruning hostile intent.",
    notes:
      "Elderoot's sanctuary field predicts collapse points in branching encounters and seals unstable routes before full cascade failures occur.",
    stats: {
      physical: 71,
      stamina: 88,
      magic: 76,
      holy: 82,
      stealth: 37,
    },
  },
  {
    name: "Ironrail",
    title: "Graph Gunsmith",
    imagePath: "/hunters/ironrail.png",
    summary:
      "Ironrail forges weighted routes into kill corridors. Every edge becomes a timed command for allied movement.",
    affinity: "Path Forging",
    clan: "Steel Vertex Guild",
    description:
      "A mechanized marksman forging weighted edges into precision corridors. He links outposts and detonates routes with engineered timing.",
    notes:
      "Ironrail can recalculate battlefield traversal in real time, synchronizing ally movement and opening shortest-route kill windows across the map.",
    stats: {
      physical: 83,
      stamina: 79,
      magic: 68,
      holy: 45,
      stealth: 58,
    },
  },
];

function HunterProtocolSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleHunterFocus = useCallback((index) => {
    setActiveIndex((prev) => (prev === index ? prev : index));
  }, []);

  return (
    <section id="hunters" className="hunters-section">
      <motion.div
        className="hunters-intro"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">Hunter Protocol</p>
        <h2 className="section-title">Legendary Hunter Chapters</h2>
        <p className="section-copy">
          Scroll to summon each legend from the dark. Every chapter reveals a
          battlefield archetype in cinematic sequence.
        </p>
        <div className="hero-actions">
          <Link to="/hunter-protocol" className="gold-btn">Start Hunter Protocol</Link>
        </div>
      </motion.div>

      <div className="hunter-wrapper">
        {hunters.map((hunter, index) => (
          <HunterShowcase
            key={hunter.name}
            hunter={hunter}
            index={index}
            onActivate={handleHunterFocus}
            activeIndex={activeIndex}
          />
        ))}
      </div>
    </section>
  );
}

export default HunterProtocolSection;
