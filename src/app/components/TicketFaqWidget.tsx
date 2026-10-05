"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SolarIcon } from "./SolarIcon";

export type TicketFaqItem = {
  question: string;
  answer: string;
};

export type TicketFaqCopy = {
  badge: string;
  title: string;
  desktopLabel?: string;
  subtitle: string;
  mobileOpenLabel: string;
  mobileCloseLabel: string;
  items: TicketFaqItem[];
};

type TicketFaqWidgetProps = {
  copy: TicketFaqCopy;
  mode: "desktop" | "mobile";
};

function ChatSparkIcon() {
  return (
    <SolarIcon name="message" className="h-4 w-4" />
  );
}

export default function TicketFaqWidget({
  copy,
  mode,
}: TicketFaqWidgetProps) {
  const isMobile = mode === "mobile";
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  useEffect(() => {
    setIsExpanded(false);
    setOpenIndex(0);
  }, [copy.title]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!rootRef.current?.contains(target)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const panel = (
    <section
      className={`ticket-faq-panel ${isMobile ? "ticket-faq-panel-mobile" : "ticket-faq-panel-desktop"}`}
      aria-label={copy.title}
    >
      <div className="ticket-faq-panel-head">
        <div className="ticket-faq-avatar" aria-hidden>
          <span className="ticket-faq-avatar-glow" />
          <ChatSparkIcon />
        </div>
        <div className="min-w-0">
          <p className="ticket-faq-badge">{copy.badge}</p>
          <h3 className="ticket-faq-title">{copy.title}</h3>
          <p className="ticket-faq-subtitle">{copy.subtitle}</p>
        </div>
        {!isMobile ? (
          <button
            type="button"
            className="ticket-faq-close"
            aria-label={copy.mobileCloseLabel}
            onClick={() => setIsExpanded(false)}
          >
            <SolarIcon name="close" className="h-4 w-4" weight="bold" />
          </button>
        ) : null}
      </div>

      <div className="ticket-faq-list-scroller">
        <div className="ticket-faq-list" role="list">
          {copy.items.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `${baseId}-answer-${index}`;
            const triggerId = `${baseId}-trigger-${index}`;

            return (
              <div
                key={item.question}
                className={`ticket-faq-item ${isOpen ? "is-open" : ""}`}
                role="listitem"
              >
                <button
                  id={triggerId}
                  type="button"
                  className="ticket-faq-question"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="ticket-faq-question-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ticket-faq-question-copy">{item.question}</span>
                  <span className="ticket-faq-question-chevron" aria-hidden>
                    <SolarIcon name="chevron-down" className="h-4 w-4" />
                  </span>
                </button>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="ticket-faq-answer-wrap"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="ticket-faq-answer-inner">
                    <p className="ticket-faq-answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  if (!isMobile) {
    const desktopLabel = copy.desktopLabel ?? copy.title;

    return (
      <div ref={rootRef} className="ticket-faq-desktop-shell">
        <button
          type="button"
          className={`ticket-faq-fab is-desktop-expanded ${isExpanded ? "is-open" : ""}`}
          aria-expanded={isExpanded}
          aria-controls={`${baseId}-desktop-panel`}
          aria-label={copy.title}
          onClick={() => setIsExpanded((current) => !current)}
        >
          <span className="ticket-faq-fab-core">
            <span className="ticket-faq-fab-mark" aria-hidden>
              ?
            </span>
          </span>
          <span className="ticket-faq-fab-copy" aria-hidden>
            <span className="ticket-faq-fab-copy-badge">{copy.badge}</span>
            <span className="ticket-faq-fab-copy-label">{desktopLabel}</span>
          </span>
        </button>
        <div
          id={`${baseId}-desktop-panel`}
          className={`ticket-faq-desktop-panel ${isExpanded ? "is-open" : ""}`}
        >
          {panel}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="ticket-faq-mobile-shell">
      <div
        className={`ticket-faq-mobile-backdrop ${isExpanded ? "is-open" : ""}`}
        aria-hidden={!isExpanded}
        onClick={() => setIsExpanded(false)}
      />
      <button
        type="button"
        className={`ticket-faq-mobile-fab ${isExpanded ? "is-open" : ""}`}
        aria-expanded={isExpanded}
        aria-controls={`${baseId}-mobile-panel`}
        aria-label={copy.title}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <span className="ticket-faq-mobile-fab-core" aria-hidden>
          {isExpanded ? (
            <SolarIcon name="close" className="h-5 w-5" weight="bold" />
          ) : (
            <span className="ticket-faq-fab-mark">?</span>
          )}
        </span>
      </button>

      <div
        id={`${baseId}-mobile-panel`}
        className={`ticket-faq-mobile-panel-wrap ${isExpanded ? "is-open" : ""}`}
      >
        <div className="ticket-faq-mobile-panel-inner">{panel}</div>
      </div>
    </div>
  );
}
