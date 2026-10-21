import { useEffect, useRef } from "react";
import { createExperience } from "../scene/createExperience.js";

export default function KoiCanvas({ theme, scroll, root, reduced, wireframe, paused, onReady }) {
  const host = useRef(null);
  const waterHost = useRef(null);
  const experience = useRef(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  useEffect(() => {
    experience.current = createExperience(host.current, {
      scroll,
      root,
      waterHost: waterHost.current,
      reducedMotion: reduced,
      onReady: () => onReadyRef.current(),
    });
    return () => {
      experience.current?.dispose();
      experience.current = null;
    };
  }, [scroll, root]);
  useEffect(() => experience.current?.setTheme(theme), [theme]);
  useEffect(() => experience.current?.setWireframe(wireframe), [wireframe]);
  useEffect(() => experience.current?.setPaused(paused), [paused]);
  useEffect(() => experience.current?.setReducedMotion(reduced), [reduced]);
  return (
    <>
      <div className="water-layer" ref={waterHost} aria-hidden="true" />
      <div className="koi-layer" ref={host} aria-hidden="true" />
    </>
  );
}
