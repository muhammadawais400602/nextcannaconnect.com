import { ImageResponse } from "next/og";

export const alt = "NextCanna Connect — Where cannabis operators connect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social share image for every page that doesn't set its own.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #003320 0%, #1a4a35 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#88b99e", textTransform: "uppercase", marginBottom: 24 }}>
          Where cannabis operators connect
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>NextCanna Connect</div>
        <div style={{ fontSize: 34, marginTop: 24, color: "#d8e6dd" }}>
          The B2B marketplace for cultivators, manufacturers, retailers and service providers.
        </div>
      </div>
    ),
    size,
  );
}
