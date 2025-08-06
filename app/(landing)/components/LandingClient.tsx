import Hero from "./Hero";
import LogoTicker from "./LogoTicker";
import Features from "./Features";
import Preview from "./Preview";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <>
      <section id="hero">
        <Hero />
      </section>
      <section>
        <LogoTicker />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="preview">
        <Preview />
      </section>
      <section id="cta">
        <CTA />
      </section>
      <Footer />
    </>
  );
}
