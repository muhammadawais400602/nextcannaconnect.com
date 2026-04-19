"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

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
  const [panelRect, setPanelRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

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

  const computeRect = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPanelRect({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX, width: r.width });
    }
  }, []);

  function handleOpen() {
    computeRect();
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    function onScroll() { computeRect(); }
    function onClickOutside(e: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, computeRect]);

  const optionBtn = (opt: FlatOption) => (
    <button
      key={opt.value}
      type="button"
      onClick={() => { onChange(opt.value); setOpen(false); }}
      onMouseEnter={(e) => { if (value !== opt.value) e.currentTarget.style.background = "#f3f4f6"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = value === opt.value ? "rgba(0,51,32,0.07)" : "transparent"; }}
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

  const panel = open && panelRect ? (
    <div
      style={{
        position: "absolute",
        top: panelRect.top,
        left: panelRect.left,
        minWidth: Math.max(panelRect.width, 220),
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
        zIndex: 9999,
        maxHeight: "300px",
        overflowY: "auto",
        padding: "6px",
        animation: "dropdownFadeIn 0.12s ease",
      }}
    >
      <style>{`@keyframes dropdownFadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {items.map((item, i) =>
        isGroup(item) ? (
          <div key={i}>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", padding: "8px 12px 4px", fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {item.groupLabel}
            </p>
            {item.options.map(optionBtn)}
          </div>
        ) : (
          optionBtn(item)
        )
      )}
    </div>
  ) : null;

  return (
    <div
      ref={triggerRef}
      style={{ position: "relative", ...wrapperStyle }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        onClick={handleOpen}
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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ flexShrink: 0, color: "#9CA3AF", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {typeof document !== "undefined" && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}
