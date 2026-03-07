import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

const districts = [
  {
    title: "Array District",
    realm: "Ancient Archive Vault Halls",
    description:
      "Monolithic archive aisles carved into black stone. Endless indexed slabs preserve every known memory sequence.",
    lore:
      "Rune-keepers guard each corridor, ensuring no element is misplaced in the vault continuum.",
    align: "left",
    backdrop:
      "radial-gradient(circle at 22% 34%, rgba(236, 213, 160, 0.23), transparent 54%), linear-gradient(140deg, rgba(18, 16, 13, 0.94), rgba(9, 9, 9, 0.92))",
  },
  {
    title: "Stack Towers",
    realm: "Vertical Stone Ascension Keeps",
    description:
      "Sheer towers rise through mist, each chamber storing layers of battle rites that can only be unwound from the summit.",
    lore:
      "Wardens climb in silence, retrieving the last sworn command before descending into the city warline.",
    align: "right",
    backdrop:
      "radial-gradient(circle at 72% 24%, rgba(232, 206, 144, 0.19), transparent 52%), linear-gradient(145deg, rgba(17, 15, 12, 0.95), rgba(8, 8, 8, 0.92))",
  },
  {
    title: "Queue Factory",
    realm: "Rune-Driven Mechanical Forge",
    description:
      "A thunderous forge where iron rails and queue sigils synchronize the order of every caravan, cannon, and command.",
    lore:
      "Every task enters by oath-mark and leaves only when the previous order has been fulfilled.",
    align: "left",
    backdrop:
      "radial-gradient(circle at 34% 18%, rgba(212, 175, 55, 0.21), transparent 52%), linear-gradient(140deg, rgba(19, 16, 13, 0.94), rgba(10, 10, 9, 0.93))",
  },
  {
    title: "Graph Nexus",
    realm: "Luminous Pathway Sanctum",
    description:
      "Branching routes pulse through vaulted ruins, linking distant battlegrounds by weighted passage and sacred relay beacons.",
    lore:
      "Path-seers chart shortest destiny lines here before each city-scale expedition.",
    align: "right",
    backdrop:
      "radial-gradient(circle at 70% 78%, rgba(228, 201, 139, 0.2), transparent 56%), linear-gradient(145deg, rgba(16, 14, 11, 0.95), rgba(8, 8, 8, 0.92))",
  },
  {
    title: "Tree Gardens",
    realm: "Living Branching Wilds",
    description:
      "A moonlit forest of algorithmic roots where each branch records a choice and each leaf remembers its outcome.",
    lore:
      "Caretakers prune corrupted branches to protect the city from cascading fate fractures.",
    align: "left",
    backdrop:
      "radial-gradient(circle at 30% 80%, rgba(220, 188, 119, 0.2), transparent 56%), linear-gradient(150deg, rgba(17, 15, 12, 0.94), rgba(8, 8, 8, 0.92))",
  },
];

const spring = { stiffness: 220, damping: 22, mass: 0.65 };

function DistrictPanel({ district, index }) {
  const panelRef = useRef(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });

  const backdropY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -18]);

  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [4, -4]), spring);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), spring);

  const onMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const onMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.article
      ref={panelRef}
      className={`district-panel district-panel-${district.align}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.85, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 950 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="district-panel-atmosphere" aria-hidden="true">
        <motion.div className="district-panel-backdrop" style={{ y: backdropY, background: district.backdrop }} />
        <div className="district-panel-vignette" />
      </div>

      <motion.div className="district-panel-content" style={{ y: contentY }}>
        <p className="district-panel-index">District {String(index + 1).padStart(2, "0")}</p>
        <h3>{district.title}</h3>
        <p className="district-panel-realm">{district.realm}</p>
        <p className="district-panel-description">{district.description}</p>
        <p className="district-panel-lore">{district.lore}</p>
      </motion.div>
    </motion.article>
  );
}

function DistrictsSection() {
  return (
    <section id="districts" className="districts-section section">
      <motion.div
        className="districts-intro"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">District Atlas</p>
        <h2 className="section-title">Walk The Engines Of Algorithia</h2>
        <p className="section-copy">
          Five legendary districts define the city. Scroll through each environment
          as if traversing the world itself.
        </p>
      </motion.div>

      <div className="district-panel-stack">
        {districts.map((district, index) => (
          <DistrictPanel key={district.title} district={district} index={index} />
        ))}
      </div>
    </section>
  );
}

export default DistrictsSection;
