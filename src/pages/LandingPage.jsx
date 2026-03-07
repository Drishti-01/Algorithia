import { Link } from "react-router-dom";
import CTASection from "../components/sections/CTASection";
import Footer from "../components/sections/Footer";
import HeroSection from "../components/sections/HeroSection";
import HunterProtocolSection from "../components/sections/HunterProtocolSection";
import Navbar from "../components/sections/Navbar";

export default function LandingPage() {
    return (
        <div className="landing-page algorithia-app">
            <div className="global-fog" aria-hidden="true">
                <div className="fog-layer-back" />
                <div className="fog-layer-mid" />
                <div className="fog-layer-front" />
            </div>

            <Navbar />

            <main>
                <HeroSection />

                <section id="project" className="section project-section">
                    <div className="project-shell">
                        <p className="section-kicker">Project Description</p>
                        <h2 className="section-title">Where Algorithms Become City Events</h2>
                        <p className="section-copy">
                            Data City is an educational platform where learners write real algorithmic logic and
                            inspect execution line by line. Every parser event and interpreter step is converted
                            into a visual action in the city world so learners can see data movement, comparisons,
                            writes, and swaps as a concrete simulation.
                        </p>
                        <Link to="/questions" className="gold-btn project-enter-btn">
                            Enter Data City
                        </Link>
                    </div>
                </section>

                <HunterProtocolSection />
                <CTASection />
            </main>

            <Footer />
        </div>
    );
}