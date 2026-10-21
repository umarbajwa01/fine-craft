import { site } from "../data/site.js";

export default function SiteFooter({ onColors, onServices }) {
  return <footer className="site-footer" id="footer">
    <div className="footer-panel glass-shell">
      <div className="footer-top">
        <div className="footer-intro">
          <p className="eyebrow">MADE WITH INTENTION</p>
          <h2>Good things.<br />Thoughtfully crafted.</h2>
          <p>{site.tagline}</p>
        </div>
        <nav className="footer-links" aria-label="Explore">
          <h3>Explore</h3><a href="#hero-copy">Home</a><a href="#features">Features</a>
          <a href="#projects">Projects &amp; files</a><a href="#timeline">Timeline</a><button onClick={onServices}>Services</button>
        </nav>
        <div className="footer-links">
          <h3>The experience</h3><button onClick={onColors}>Choose your palette ↗</button>
          <span>Move your cursor.<br />Follow the current.</span><a href="#hero-copy">Back to top ↑</a>
        </div>
      </div>
      <a className="footer-wordmark" href="#hero-copy" aria-label={`${site.brand} — back to top`}>{site.brand}</a>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {site.brand}</span><span>Design · Development · Motion</span></div>
    </div>
  </footer>;
}
