import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Project", href: "#project" },
  { label: "Hunters", href: "#hunters" },
  { label: "Gate", href: "#enter" },
];

function Navbar() {
  return (
    <motion.nav
      className="nav-shell"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav-inner">
        <a className="nav-brand" href="#hero" aria-label="Algorithia home">
          <span className="nav-brand-mark">D</span>
          <span>Data City</span>
        </a>

        <div className="nav-links" role="navigation" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav-route-actions">
          <Link className="nav-cta" to="/login">Enter Data City</Link>
          <Link className="nav-cta nav-cta-alt" to="/hunter-protocol">Hunter Protocol</Link>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
