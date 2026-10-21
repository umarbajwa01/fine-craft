import { useEffect, useRef, useState } from "react";
import KoiCanvas from "./components/KoiCanvas.jsx";
import Constellation from "./components/Constellation.jsx";
import ServicesPanel from "./components/ServicesPanel.jsx";
import FeaturesWithPanel from "./components/FeaturesWithPanel.jsx";
import TimelineBasic from "./components/TimelineBasic.jsx";
import SkillsStrip from "./components/SkillsStrip.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import Projects from "./components/Projects.jsx";
import Navbar from "./components/Navbar.jsx";
import FishColorFilters from "./components/FishColorFilters.jsx";
import { site } from "./data/site.js";
import { useMotionPreference } from "./hooks/useMotionPreference.js";
import { useScrollMotion } from "./hooks/useScrollMotion.js";
import { THEMES } from "./themes.js";

export default function App() {
  const root = useRef(null), scroll = useRef(0);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelSection, setPanelSection] = useState("services");
  const [theme, setTheme] = useState("coral");
  const [wireframe, setWireframe] = useState(null);
  const reduced = useMotionPreference();
  const navigate = useScrollMotion(root, scroll, reduced);
  const palette = THEMES[theme];
  const openPanel = (section) => { setPanelSection(section); setMenuOpen(true); };

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]').content = palette.background;
  }, [palette]);

  return (
    <main ref={root} className={`experience theme-${theme}${ready ? " is-ready" : ""}${reduced ? " reduce-motion" : ""}${menuOpen ? " is-motion-paused" : ""}`}>
      <FishColorFilters />
      <a className="skip-link" href="#hero-copy">Skip to introduction</a>
      <div className="page-atmosphere" aria-hidden="true">
        <div className="atmosphere" /><div className="paper-grain" /><Constellation />
      </div>
      <KoiCanvas theme={theme} scroll={scroll} root={root} reduced={reduced}
        wireframe={wireframe} paused={menuOpen} onReady={() => setReady(true)} />
      <Navbar menuOpen={menuOpen} panelSection={panelSection}
        onHome={() => navigate(0)} onProjects={() => navigate("#projects")}
        onServices={() => openPanel("services")} onColors={() => openPanel("colors")}
        onProcess={() => navigate("#timeline")} />
      <div className="hero-scroll">
        <div className="stage">
          <div className="hero-title-wrap"><h1 className="hero-title" id="hero-copy">{site.brand}</h1></div>
          <div className="hero-footer">
            <div className="signature">
              <p>Branding shaped to endure and evolve<br className="desktop-break" /> with your ambition</p>
              <div className="wordmark">{site.brand}</div>
            </div>
            <a className="hero-contact" href="#features">Explore the details <span aria-hidden="true">↗</span></a>
          </div>
          <div className="scroll-track" aria-hidden="true"><span className="scroll-fill" /></div>
          <div className="loading-state" aria-hidden={ready} aria-live="polite">
            <span className="loading-label">A LITTLE FINE CRAFT IS COMING TO LIFE</span><span className="loading-line" />
          </div>
          <span className="sr-only" role="status">{ready ? "Interactive koi ready. Move your pointer to guide the fish." : "Preparing the interactive koi."}</span>
        </div>
      </div>
      <SkillsStrip paused={menuOpen} />
      <FeaturesWithPanel reduced={reduced} />
      <Projects />
      <TimelineBasic />
      <SiteFooter onColors={() => openPanel("colors")} onServices={() => openPanel("services")} />
      <ServicesPanel open={menuOpen} section={panelSection} onClose={() => setMenuOpen(false)}
        theme={theme} onThemeChange={setTheme} wireframe={wireframe} onWireframeChange={setWireframe} />
    </main>
  );
}
