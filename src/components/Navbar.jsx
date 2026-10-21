import { site } from "../data/site.js";

export default function Navbar({ menuOpen, panelSection, onHome, onProjects, onServices, onColors, onProcess }) {
  return <header className="site-header">
    <nav className="orbit-nav glass-shell" aria-label="Main navigation">
      <button onClick={onProjects}>Projects</button>
      <button onClick={onServices} aria-haspopup="dialog" aria-controls="services-panel" aria-expanded={menuOpen && panelSection === "services"}>Services</button>
      <button className="nav-fish" onClick={onHome} aria-label={`${site.brand} — back to top`}>
        <svg viewBox="54 12 101 124" aria-hidden="true" focusable="false">
          <defs>
            <filter id="nav-fish-invert" colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" />
            </filter>
            <mask id="nav-fish-mask" maskUnits="userSpaceOnUse" x="54" y="12" width="101" height="124" style={{ maskType: "luminance" }}>
              <image href="/assets/navbar-fish-source.png" width="209" height="148" filter="url(#nav-fish-invert)" />
            </mask>
          </defs>
          <rect x="54" y="12" width="101" height="124" fill="currentColor" mask="url(#nav-fish-mask)" />
        </svg>
      </button>
      <button onClick={onColors} aria-haspopup="dialog" aria-controls="services-panel" aria-expanded={menuOpen && panelSection === "colors"}>Colors</button>
      <button onClick={onProcess}>Process</button>
    </nav>
  </header>;
}
