"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  questionStyle?: React.CSSProperties;
  answerStyle?: React.CSSProperties;
  chevronColor?: string;
}

export default function FaqAccordion({
  items,
  style,
  itemStyle,
  questionStyle,
  answerStyle,
  chevronColor = "#717973",
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", ...style }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} style={itemStyle}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1b1c1b",
                background: "none",
                border: "none",
                textAlign: "left",
                ...questionStyle,
              }}
              aria-expanded={isOpen}
            >
              {item.q}
              <span
                className="material-symbols-outlined"
                style={{
                  color: chevronColor,
                  transition: "transform 0.2s ease",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  flexShrink: 0,
                  marginLeft: "12px",
                }}
              >
                expand_more
              </span>
            </button>
            <div
              style={{
                overflow: "hidden",
                maxHeight: isOpen ? "500px" : "0",
                transition: "max-height 0.25s ease",
              }}
            >
              <div
                style={{
                  padding: "0 16px 16px",
                  fontSize: "14px",
                  color: "#414943",
                  lineHeight: 1.6,
                  ...answerStyle,
                }}
              >
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
