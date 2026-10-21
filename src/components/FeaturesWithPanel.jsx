import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { features } from "../data/features.jsx";

function FeatureMedia({ content }) {
  return <div className="feature-content">{content}</div>;
}

function Preview({ item, index, reduced }) {
  const panel = useRef(null);
  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => gsap.fromTo(panel.current,
      { opacity: 0, y: 12, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }), panel);
    return () => context.revert();
  }, [index, reduced]);
  return <div ref={panel} id={`feature-panel-${index}`} role="region" aria-labelledby={`feature-button-${index}`} className="feature-preview">
    <FeatureMedia key={index} content={item.content} />
  </div>;
}

export default function FeaturesWithPanel({ reduced = false }) {
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return <section className="features-section" id="features" aria-labelledby="features-title">
    <div className="features-grid">
      <div>
        <p className="eyebrow">THE DETAILS MAKE THE DIFFERENCE</p>
        <h2 id="features-title">Features.</h2>
        <ul className="feature-list">
          {features.map((item, index) => <li key={item.title} className={active === index ? "is-selected" : ""}>
            <button id={`feature-button-${index}`} className="feature-trigger" onClick={() => setActive(index)}
              aria-expanded={active === index} aria-controls={active === index ? `feature-panel-${index}` : undefined}>
              <span className="feature-number" aria-hidden="true">{index + 1}</span><span>{item.title}</span>
            </button>
            {!desktop && active === index && <Preview item={item} index={index} reduced={reduced} />}
          </li>)}
        </ul>
      </div>
      {desktop && <div className="feature-sticky"><Preview item={features[active]} index={active} reduced={reduced} /></div>}
    </div>
  </section>;
}
