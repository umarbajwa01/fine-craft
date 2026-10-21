import { useEffect, useRef, useState } from "react";
import GlassFolder from "./GlassFolder.jsx";

const folders = [
  { label: "Living Koi", art: "ember", category: "Interactive experiment", description: "The artwork and interaction notes behind a fish that follows the current.",
    files: [
      { name: "Koi artwork", meta: "PNG ↗", image: "/assets/koi-coral-v2.png", href: "/assets/koi-coral-v2.png" },
      { name: "Interaction notes", meta: "Read ↗", art: "ember", href: "/files/interaction-notes.txt" },
    ] },
  { label: "Palette Studies", art: "glacier", category: "Colour & atmosphere", description: "Seven colour directions, shared by the fish, glass folders and the world around them.",
    files: [
      { name: "Palette guide", meta: "Read ↗", art: "glacier", href: "/files/palette-guide.txt" },
      { name: "Colour values", meta: "JSON ↗", art: "aurora", href: "/files/palettes.json" },
    ] },
];

function ProjectFolder({ folder, index }) {
  const host = useRef(null);
  const [width, setWidth] = useState(280);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.min(340, entry.contentRect.width)));
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <article ref={host} className="project-folder">
    <GlassFolder label={folder.label} art={folder.art} files={folder.files} width={width}
      tone="dark" action="more" appearDelay={index * 140} seed={index + 3} />
    <div className="project-reading"><div className="project-caption"><span>0{index + 1}</span>{folder.category}</div>
      <p className="project-description">{folder.description}</p>
    </div>
  </article>;
}

export default function Projects() {
  return <section className="projects-section" id="projects" aria-labelledby="projects-title">
    <div className="projects-heading">
      <div><p className="eyebrow">THE DETAILS, UP CLOSE</p><h2 id="projects-title">Projects &amp; files.</h2></div>
      <p>A collection of experiments, colour studies and creative details. Open a folder to explore.</p>
    </div>
    <div className="project-folders">{folders.map((folder, index) => <ProjectFolder key={folder.label} folder={folder} index={index} />)}</div>
  </section>;
}
