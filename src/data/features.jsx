const details = [
  { title: "A little craft. A lasting impression.", label: "Thoughtfully shaped identities.", detail: "Clear ideas, distinctive forms and the details that give a brand its own character.", tags: ["Identity", "Typography", "Art direction"], example: "Branding shaped to endure and evolve with your ambition." },
  { title: "Digital experiences with feeling.", label: "Made to be explored.", detail: "Responsive layouts and purposeful interactions bring every part of the experience together.", tags: ["Interfaces", "Interaction", "Development"], example: "From the first impression to the smallest interaction." },
  { title: "Motion that follows your lead.", label: "A world in gentle motion.", detail: "Guide the koi with your cursor and watch it turn, drift and swim through the page.", tags: ["Movement", "Rhythm", "Continuity"], example: "One continuous scene, from the hero to the footer." },
  { title: "A palette for every mood.", label: "Colour, in harmony.", detail: "Choose from seven palettes. The fish, atmosphere and glass details change together.", tags: ["Seven palettes", "Light", "Atmosphere"], example: "Open Colors in the navigation to make it your own." },
  { title: "Considered on every screen.", label: "Every detail has a place.", detail: "The same quiet visual language adapts across wide screens, tablets and smaller displays.", tags: ["Responsive", "Readable", "Accessible"], example: "Natural movement, with respect for reduced-motion preferences." },
];

export const features = details.map((item, index) => ({ title: item.title, alt: item.label, content:
  <div className="capability-board">
    <span className="capability-index">0{index + 1} / FINE CRAFT</span>
    <h3>{item.label}</h3><p>{item.detail}</p>
    <div className="capability-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    <p className="capability-example">{item.example}</p>
  </div>
}));
