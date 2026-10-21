import { skills } from "../data/skills.js";

export default function SkillsStrip({ paused = false }) {
  return (
    <section className="skills-section" aria-label="Skills">
      <div className={`skills-strip${paused ? " is-stopped" : ""}`}>
        <span className="skills-label" aria-hidden="true">Skills</span>
        <div className="skills-window">
          <div className="skills-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="skills-group" aria-hidden={copy === 1 ? "true" : undefined}>
                {skills.map((skill) => <li key={skill}><span>{skill}</span><span className="skills-divider" aria-hidden="true">✳</span></li>)}
              </ul>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
