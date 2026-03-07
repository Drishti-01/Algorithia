import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const snippetLines = [
  "function pathToCitadel(graph, source) {",
  "  const queue = [source];",
  "  const visited = new Set([source]);",
  "",
  "  while (queue.length) {",
  "    const node = queue.shift();",
  "    illuminate(node);",
  "",
  "    for (const edge of graph[node]) {",
  "      if (!visited.has(edge)) {",
  "        visited.add(edge);",
  "        queue.push(edge);",
  "      }",
  "    }",
  "  }",
  "",
  "  return [...visited];",
  "}",
];

const runeSet = ["<>", "[]", "{}", "::", "//", "&&", "||", "==", "++", "=>"];
const totalBlocks = 18;

function CodeSimulationSection() {
  const fullSnippet = useMemo(() => snippetLines.join("\n"), []);
  const [typedCode, setTypedCode] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setTypedCode(fullSnippet.slice(0, index));

      if (index >= fullSnippet.length) {
        clearInterval(timer);
      }
    }, 24);

    return () => clearInterval(timer);
  }, [fullSnippet]);

  const progress = typedCode.length / fullSnippet.length;
  const activeLine = Math.min(typedCode.split("\n").length, snippetLines.length);

  return (
    <section id="simulation" className="simulation-section section">
      <motion.div
        className="simulation-intro"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">Code Simulation</p>
        <h2 className="section-title">The Arcane Algorithm Console</h2>
        <p className="section-copy">
          Ancient script unfolds on the left while the rune-reactor responds in
          real time to each executed instruction.
        </p>
      </motion.div>

      <div className="simulation-wrap">
        <motion.div
          className="code-panel arcane-console"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="code-header">
            <p>Arcane Console // citadel-path.js</p>
            <span className="console-sigil">*</span>
          </div>

          <div className="arcane-runes" aria-hidden="true">
            {runeSet.map((rune, index) => (
              <span key={`${rune}-${index}`} className="arcane-rune">
                {rune}
              </span>
            ))}
          </div>

          <div className="code-scroll">
            <pre>
              <code>{typedCode}</code>
              <span className="code-cursor" aria-hidden="true" />
            </pre>
          </div>

          <p className="code-meta">Glyph line resonance: {activeLine}</p>
        </motion.div>

        <motion.div
          className="simulation-panel rune-reactor"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <div className="reactor-halo" aria-hidden="true" />

          <div className="simulation-grid" aria-hidden="true">
            {Array.from({ length: totalBlocks }, (_, index) => {
              const threshold = (index + 1) / totalBlocks;
              const active = progress >= threshold;

              return (
                <motion.div
                  key={index}
                  className="sim-block"
                  animate={{
                    opacity: active ? 1 : 0.28,
                    scale: active ? 1 : 0.92,
                    boxShadow: active
                      ? "0 0 24px rgba(212, 175, 55, 0.48), 0 0 36px rgba(232, 206, 131, 0.22)"
                      : "0 0 0 rgba(0, 0, 0, 0)",
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.div>
              );
            })}
          </div>

          <div className="simulation-status">
            <p>Reactor Output</p>
            <h3>{Math.round(progress * 100)}%</h3>
            <span>Rune lattice synchronized</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CodeSimulationSection;
