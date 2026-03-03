import React from 'react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="landing-bg">
            <nav className="landing-nav slide-up">
                <div className="nav-brand">
                    <span className="logo-icon-small">✨</span>
                    <span>Style Draft</span>
                </div>
            </nav>

            <main className="landing-layout">
                <section className="landing-art slide-right">
                    <div className="artwork-container">
                        <img src="/img/landing_sketch.png" alt="Elegant fashion sketch" className="hero-image" />
                    </div>
                </section>

                <section className="landing-content slide-left delay-1">
                    <div className="content-wrapper">
                        <div className="landing-badge delay-1">AI-ASSISTED DESIGN</div>
                        <h1 className="landing-title delay-1">ELEVATE YOUR<br />STYLE</h1>
                        <p className="landing-description delay-1">
                            The ultimate custom womenswear and fashion experience is
                            here. Design your unique outfits, experiment
                            with color palettes, and draft your signature look seamlessly.
                        </p>
                        <p className="landing-subtext delay-1">
                            Join us today to begin building a perfectly tailored wardrobe.
                        </p>

                        <button className="landing-cta-btn delay-2" onClick={onGetStarted}>
                            GET STARTED &rarr;
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};
