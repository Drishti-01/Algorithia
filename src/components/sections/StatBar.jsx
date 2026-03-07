import { motion } from "framer-motion";

function StatBar({ label, value, index, revealed, isHovered }) {
  return (
    <motion.div
      className="statbar-row"
      initial={{ opacity: 0, x: -28 }}
      animate={revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
      transition={{
        duration: 0.55,
        delay: 1.14 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="statbar-head">
        <span className="statbar-name">{label}</span>
        <span className="statbar-value">{value}</span>
      </div>
      <div className="statbar-track">
        <motion.span
          className="statbar-fill"
          initial={{ width: 0, scaleY: 1 }}
          animate={
            revealed
              ? { width: `${value}%`, scaleY: isHovered ? [1, 1.14, 1] : 1 }
              : { width: 0, scaleY: 1 }
          }
          transition={{
            duration: 1.05,
            delay: 1.22 + index * 0.12,
            ease: [0.22, 1, 0.36, 1],
            scaleY: {
              duration: 0.95,
              repeat: isHovered ? Infinity : 0,
              repeatType: "mirror",
              delay: index * 0.07,
              ease: "easeInOut",
            },
          }}
          style={{ transformOrigin: "center" }}
        />
      </div>
    </motion.div>
  );
}

export default StatBar;
