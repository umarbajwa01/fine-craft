import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
// Lenis receives a continuous clock even after a slow rendering frame.
gsap.ticker.lagSmoothing(0);

export function useScrollMotion(root, scroll, reduced) {
  const instance = useRef(null);
  const navigate = useCallback((target) => {
    if (instance.current) instance.current.scrollTo(target, { offset: typeof target === "number" ? 0 : -100 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "instant" });
    else root.current?.querySelector(target)?.scrollIntoView({ behavior: "instant" });
  }, [root]);
  useEffect(() => {
    if (reduced) {
      scroll.current = 0;
      return;
    }
    const lenis = new Lenis({
      duration: 0.9,
      easing: t => 1 - Math.pow(1 - t, 3),
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -100 },
      prevent: node => !!node.closest("[data-lenis-prevent]"),
    });
    instance.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const notifyLayout = () => window.dispatchEvent(new Event("fine-craft:layout"));
    ScrollTrigger.addEventListener("refresh", notifyLayout);
    let refreshFrame, active = true;
    const refresh = () => { if (!active) return; cancelAnimationFrame(refreshFrame); refreshFrame = requestAnimationFrame(() => { ScrollTrigger.refresh(); lenis.resize(); }); };
    window.addEventListener("load", refresh);
    document.fonts.ready.then(refresh);
    // ScrollTrigger already refreshes on viewport resize. Avoid watching the root:
    // pin spacing changes its height and can repeatedly refresh while scrolling.
    const tick = (seconds) => lenis.raf(seconds * 1000);
    gsap.ticker.add(tick);
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current.querySelector(".hero-scroll"),
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          onUpdate: (self) => {
            scroll.current = self.progress;
          },
        },
      });
      timeline.to(
        ".hero-title",
        { scale: 1.1, yPercent: -7, letterSpacing: "-0.065em", ease: "none" },
        0,
      );
      timeline.to(
        ".constellation",
        { rotation: 7, scale: 1.04, yPercent: -5, ease: "none" },
        0,
      );
      timeline.to(".scroll-fill", { scaleX: 1, ease: "none" }, 0);

    }, root);
    return () => {
      active = false;
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(refreshFrame);
      context.revert();
      ScrollTrigger.removeEventListener("refresh", notifyLayout);
      gsap.ticker.remove(tick);
      instance.current = null;
      lenis.destroy();
    };
  }, [root, scroll, reduced]);
  return navigate;
}
