import { motion } from "framer-motion";
import vexaraImage from "../../assets/hunters/vexara.png";
import kaelImage from "../../assets/hunters/kael.png";
import elderootImage from "../../assets/hunters/elderoot.png";
import ironrailImage from "../../assets/hunters/ironrail.png";
import HunterReveal from "./HunterReveal";

const hunters = [
  {
    name: "Vexara",
    title: "Shadow Arcanist",
    image: vexaraImage,
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
    image: kaelImage,
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
    image: elderootImage,
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
    image: ironrailImage,
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
  return (
    <section id="hunters" className="hunters-section section">
      <motion.div
        className="hunters-intro"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">Hunter Protocol</p>
        <h2 className="section-title">Legends Of The Algorithmic Siege</h2>
        <p className="section-copy">
          Scroll to reveal each hunter in sequence. Every scene unveils combat
          profile, faction lore, and battlefield potential.
        </p>
      </motion.div>

      <div className="hunter-reveal-stack">
        {hunters.map((hunter, index) => (
          <HunterReveal key={hunter.name} hunter={hunter} index={index} />
        ))}
      </div>
    </section>
  );
}

export default HunterProtocolSection;
