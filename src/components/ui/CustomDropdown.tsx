"use client";

import { useState, useRef, useEffect } from "react";

export interface FlatOption {
  value: string;
  label: string;
}

export interface OptionGroup {
  groupLabel: string;
  options: FlatOption[];
}

export type DropdownItem = FlatOption | OptionGroup;

function isGroup(item: DropdownItem): item is OptionGroup {
  return "groupLabel" in item;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  items: DropdownItem[];
  placeholder?: string;
  wrapperStyle?: React.CSSProperties;
  triggerStyle?: React.CSSProperties;
}

export default function CustomDropdown({
  value,
  onChange,
  items,
  placeholder = "Select…",
  wrapperStyle,
  triggerStyle,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = (() => {
    for (const item of items) {
      if (isGroup(item)) {
        const found = item.options.find((o) => o.value === value);
        if (found) return found.label;
      } else if (item.value === value) {
        return item.label;
      }
    }
    return null;
  })();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const optionBtn = (opt: FlatOption) => (
    <button
      key={opt.value}
      type="button"
      onClick={() => { onChange(opt.value); setOpen(false); }}
      onMouseEnter={(e) => {
        if (value !== opt.value) e.currentTarget.style.background = "#f3f4f6";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = value === opt.value ? "rgba(0,51,32,0.07)" : "transparent";
      }}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "9px 12px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        color: value === opt.value ? "#003320" : "#374151",
        fontWeight: value === opt.value ? 600 : 400,
        background: value === opt.value ? "rgba(0,51,32,0.07)" : "transparent",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background 0.1s",
      }}
    >
      {opt.label}
    </button>
  );

  return (
    <div
      ref={ref}
      style={{ position: "relative", ...wrapperStyle }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          background: "transparent",
          border: "none",
          outline: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          color: value ? "#111827" : "#9CA3AF",
          ...triggerStyle,
        }}
      >
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedLabel ?? placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            flexShrink: 0,
            color: "#9CA3AF",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            left: 0,
            minWidth: "220px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.13)",
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
            padding: "6px",
          }}
        >
          {items.map((item, i) =>
            isGroup(item) ? (
              <div key={i}>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#9CA3AF",
                    padding: "8px 12px 4px",
                    fontFamily: "'Inter', sans-serif",
                    margin: 0,
                  }}
                >
                  {item.groupLabel}
                </p>
                {item.options.map(optionBtn)}
              </div>
            ) : (
              optionBtn(item)
            )
          )}
        </div>
      )}
    </div>
  );
}
