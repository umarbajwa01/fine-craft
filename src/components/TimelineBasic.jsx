import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPreference } from "../hooks/useMotionPreference.js";
import { timelineProgress, timelineOverflow, journeyScrollDistance } from "../animation/timelineProgress.js";
import {
  Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator,
  TimelineItem, TimelineSeparator, TimelineTitle,
} from "./ui/Timeline.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function TimelineBasic() {
  const section = useRef(null);
  const reduced = useMotionPreference();
  const [milestones, setMilestones] = useState({ completed: 1, active: 2 });
  useLayoutEffect(() => {
    const el = section.current;
    const panel = el.querySelector(".timeline-pin");
    const list = el.querySelector(".timeline");
    const windowEl = el.querySelector(".timeline-window");
    const items = [...el.querySelectorAll(".timeline-item")];
    let currentCompleted = -1, overflow = 0;
    const measure = () => {
      const style = getComputedStyle(windowEl);
      overflow = reduced ? 0 : timelineOverflow(list.scrollHeight, windowEl.clientHeight,
        parseFloat(style.paddingTop) || 0, parseFloat(style.paddingBottom) || 0);
    };
    const paint = (progress) => {
      const next = timelineProgress(progress);
      items.forEach((item, index) => item.style.setProperty("--step-progress", Math.max(0, Math.min(1, next.travel - index))));
      // On short/mobile screens, bring each later milestone into the pinned reading area.
      list.style.transform = `translate3d(0, ${-overflow * Math.min(1, next.travel / 3)}px, 0)`;
      if (next.completed !== currentCompleted) {
        currentCompleted = next.completed;
        setMilestones({ completed: next.completed, active: next.active });
      }
    };
    if (reduced) {
      paint(1);
      return () => { items.forEach(item => item.style.removeProperty("--step-progress")); gsap.set(list, { clearProps: "transform" }); };
    }
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        pin: panel,
        start: "top top",
        end: () => `+=${journeyScrollDistance(window.innerHeight)}`,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => paint(self.progress),
        onRefresh: self => { measure(); paint(self.progress); },
      });
    }, el);
    return () => {
      context.revert();
      items.forEach(item => item.style.removeProperty("--step-progress"));
      gsap.set(list, { clearProps: "transform" });
    };
  }, [reduced]);
  return (
    <section ref={section} className={`timeline-section${reduced ? " timeline-static" : ""}`} id="timeline" aria-labelledby="timeline-title">
      <div className="timeline-pin">
      <div className="timeline-intro">
        <p className="eyebrow">FROM IDEA TO LAUNCH</p>
        <h2 id="timeline-title">Project timeline.</h2>
        <p className="timeline-hint">Scroll to follow the process <span aria-hidden="true">↓</span></p>
      </div>
      <div className="timeline-window">
      <Timeline value={milestones.active} completed={milestones.completed}>
        <TimelineItem step={1}>
          <TimelineIndicator /><TimelineSeparator />
          <TimelineHeader>
            <TimelineDate dateTime="2024-01">Jan 2024</TimelineDate>
            <TimelineTitle>Project started</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>Initial project setup and planning phase completed.</TimelineContent>
        </TimelineItem>
        <TimelineItem step={2}>
          <TimelineIndicator /><TimelineSeparator />
          <TimelineHeader>
            <TimelineDate dateTime="2024-02">Feb 2024</TimelineDate>
            <TimelineTitle>Design phase</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>UI/UX design mockups and wireframes created.</TimelineContent>
        </TimelineItem>
        <TimelineItem step={3}>
          <TimelineIndicator /><TimelineSeparator />
          <TimelineHeader>
            <TimelineDate dateTime="2024-03">Mar 2024</TimelineDate>
            <TimelineTitle>Development</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>Core application development and feature implementation.</TimelineContent>
        </TimelineItem>
        <TimelineItem step={4}>
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate dateTime="2024-04">Apr 2024</TimelineDate>
            <TimelineTitle>Testing &amp; Launch</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>Quality assurance testing and production deployment.</TimelineContent>
        </TimelineItem>
      </Timeline>
      </div>
      </div>
    </section>
  );
}
