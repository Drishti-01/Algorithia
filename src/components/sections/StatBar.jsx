import { motion } from "framer-motion";

function StatBar({ label, value, index }) {
  return (
    <div className="statbar-row">
      <div className="statbar-head">
        <span className="statbar-name">{label}</span>
        <span className="statbar-value">{value}</span>
      </div>
      <div className="statbar-track">
        <motion.span
          className="statbar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.75 }}
          transition={{
            duration: 1.05,
            delay: 0.14 + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </div>
  );
}

export default StatBar;
