import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroVideo from "../../assets/videos/Hero.mp4";

const embers = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: `${(index * 0.4) % 8}s`,
  duration: `${7 + ((index * 1.7) % 6)}s`,
}));

function HeroSection() {
  return (
    <section id="hero" className="hero-section section">
      <video className="hero-video" src={heroVideo} autoPlay muted loop playsInline />
      <div className="hero-overlay" />

      <div className="ember-field" aria-hidden="true">
        {embers.map((ember) => (
          <span
            key={ember.id}
            className="ember"
            style={{
              left: ember.left,
              animationDelay: ember.delay,
              animationDuration: ember.duration,
            }}
          />
        ))}
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-kicker">Cinematic Dark Fantasy Landing</p>
        <h1>Data City</h1>
        <p className="hero-subtitle">Write real algorithms and watch execution become a living district.</p>

        <div className="hero-actions">
          <Link to="/questions" className="gold-btn">
            Enter Data City
          </Link>
          <a href="#hunters" className="ghost-btn">
            Meet the Hunters
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
