import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import CTASection from "../components/sections/CTASection";
import Footer from "../components/sections/Footer";
import HeroSection from "../components/sections/HeroSection";
import Navbar from "../components/sections/Navbar";

const HunterProtocolSection = lazy(() => import("../components/sections/HunterProtocolSection"));

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
                        <p className="section-kicker">About Data City</p>
                        <h2 className="section-title">Where Algorithms Become City Events</h2>
                        <p className="section-copy">
                            Data City is an educational platform where learners write real algorithmic logic and
                            inspect execution line by line. Every parser event and interpreter step is converted
                            into a visual action in the city world so learners can see data movement, comparisons,
                            writes, and swaps as a concrete simulation.
                        </p>
                        <Link to="/login" className="gold-btn project-enter-btn">
                            Enter Data City
                        </Link>
                    </div>
                </section>

                <Suspense
                    fallback={(
                        <section className="hunters-section" style={{ padding: "4rem 0", textAlign: "center" }}>
                            <p className="section-kicker">Hunter Protocol</p>
                            <p style={{ color: "#f0c040", letterSpacing: "0.18em" }}>Loading dossiers…</p>
                        </section>
                    )}
                >
                    <HunterProtocolSection />
                </Suspense>
                <CTASection />
            </main>

            <Footer />
        </div>
    );
}
