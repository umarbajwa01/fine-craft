import { createContext, useContext } from "react";

const TimelineContext = createContext({ current: 1, completed: 0 });
const StepContext = createContext({ step: 1, status: "upcoming" });

export function Timeline({ defaultValue = 1, value, completed, children }) {
  const current = value ?? defaultValue;
  return <TimelineContext.Provider value={{ current, completed: completed ?? current - 1 }}>
    <ol className="timeline" aria-label="Project milestones">{children}</ol>
  </TimelineContext.Provider>;
}

export function TimelineItem({ step, children }) {
  const { current, completed } = useContext(TimelineContext);
  const status = step <= completed ? "complete" : step === current ? "current" : "upcoming";
  return <StepContext.Provider value={{ step, status }}>
    <li className={`timeline-item timeline-item--${status}`} aria-current={status === "current" ? "step" : undefined}>{children}</li>
  </StepContext.Provider>;
}

export function TimelineIndicator() {
  const { step, status } = useContext(StepContext);
  return <span className="timeline-indicator">
    <span aria-hidden="true">{status === "complete" ? "✓" : step}</span>
    <span className="sr-only">Step {step}, {status}. </span>
  </span>;
}

export function TimelineSeparator() {
  return <span className="timeline-separator" aria-hidden="true"><span className="timeline-separator-fill" /></span>;
}

export function TimelineHeader({ children }) {
  return <div className="timeline-header">{children}</div>;
}

export function TimelineDate({ children, dateTime }) {
  return <time className="timeline-date" dateTime={dateTime}>{children}</time>;
}

export function TimelineTitle({ children }) {
  return <h3 className="timeline-title">{children}</h3>;
}

export function TimelineContent({ children }) {
  return <p className="timeline-content">{children}</p>;
}
