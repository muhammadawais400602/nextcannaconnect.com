"use client";

// Last-resort error screen (when the root layout itself fails).
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fbf9f8", color: "#1b1c1c" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
          <div>
            <h1 style={{ color: "#003320", fontWeight: 500 }}>NextCanna Connect is having trouble</h1>
            <p style={{ color: "#5a6360" }}>Please try again in a moment.</p>
            <button type="button" onClick={reset} style={{ background: "#003320", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer" }}>
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
