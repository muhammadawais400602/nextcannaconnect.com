import { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperStyle?: React.CSSProperties;
  ghost?: boolean; // true = no border/bg, just a custom chevron (for selects inside styled containers)
}

export default function CustomSelect({ wrapperStyle, ghost, style, children, onFocus, onBlur, ...props }: Props) {
  const baseSelectStyle: React.CSSProperties = ghost
    ? {
        width: "100%",
        appearance: "none",
        background: "transparent",
        border: "none",
        outline: "none",
        paddingRight: "20px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        color: "inherit",
        cursor: "pointer",
        ...style,
      }
    : {
        width: "100%",
        appearance: "none",
        backgroundColor: "white",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        padding: "10px 36px 10px 12px",
        fontSize: "13px",
        fontFamily: "'Inter', sans-serif",
        color: "#111827",
        cursor: "pointer",
        outline: "none",
        transition: "border-color 0.15s",
        boxSizing: "border-box" as const,
        ...style,
      };

  return (
    <div style={{ position: "relative", display: "block", ...wrapperStyle }}>
      <select
        {...props}
        style={baseSelectStyle}
        onFocus={(e) => {
          if (!ghost) e.currentTarget.style.borderColor = "#003320";
          onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!ghost) e.currentTarget.style.borderColor = "#d1d5db";
          onBlur?.(e);
        }}
      >
        {children}
      </select>
      <span
        style={{
          position: "absolute",
          right: ghost ? "0" : "12px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          color: "#6B7280",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </div>
  );
}
