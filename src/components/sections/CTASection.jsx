import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gateVideo from "../../assets/videos/gate.mp4";

function CTASection() {
  return (
    <section id="enter" className="cta-section section">
      <video
        className="cta-video"
        src={gateVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      <div className="cta-backdrop" />

      <motion.div
        className="cta-panel"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">Final Gate</p>
        <h2>Enter Data City</h2>
        <p>Choose a challenge and run your code through the city simulation engine.</p>

        <div className="cta-actions">
          <Link to="/login" className="gold-btn">
            Enter Data City
          </Link>
          <Link to="/hunter-protocol" className="gold-btn hunter-gate-btn">
            Start Hunter Protocol
          </Link>
          <a href="#hunters" className="ghost-btn">
            Meet the Hunters
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default CTASection;
