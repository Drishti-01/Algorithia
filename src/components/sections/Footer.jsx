import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <section className="site-footer-col site-footer-brand" aria-label="Brand">
            <p className="site-footer-label">Data City</p>
            <p className="site-footer-description">
             Write the Algorithm.<br /> Watch It Come Alive.
            </p>
          </section>

          <nav className="site-footer-col" aria-label="Project links">
            <p className="site-footer-col-title">Project</p>
            <a href="#project">About the Project</a>
            <a href="#project">How It Works</a>
            <a href="#hunters">Hunters</a>
            <a href="#enter">Gate</a>
          </nav>

          <nav className="site-footer-col" aria-label="Resources links">
            <p className="site-footer-col-title">Resources</p>
            <a href="#project">Documentation</a>
            <Link to="/questions">Challenges</Link>
            <a href="#project">Learning Path</a>
          </nav>

          <nav className="site-footer-col" aria-label="Legal links">
            <p className="site-footer-col-title">Legal</p>
            <a href="#project">Privacy Policy</a>
            <a href="#project">Terms of Service</a>
          </nav>

          <nav className="site-footer-col" aria-label="Contact links">
            <p className="site-footer-col-title">Contact</p>
            <a href="mailto:hello@datacity.app">Algorithia@support.com</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </nav>
        </div>
      </div>

      <p className="site-footer-meta">&copy; {year} Data City. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
