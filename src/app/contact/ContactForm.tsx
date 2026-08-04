"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid rgba(0,51,32,0.15)",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#1b1c1c",
  backgroundColor: "white",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid rgba(0,51,32,0.1)",
          borderRadius: "20px",
          padding: "48px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: "italic", fontSize: "22px", color: "#003320", margin: "0 0 12px" }}>
          Message sent!
        </h3>
        <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7 }}>
          Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          style={{ marginTop: "24px", background: "none", border: "none", color: "#003320", fontSize: "13px", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(0,51,32,0.1)",
        borderRadius: "20px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: "6px" }}>
            Name *
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#003320"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,51,32,0.15)"; }}
          />
        </div>
        <div>
          <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: "6px" }}>
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#003320"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,51,32,0.15)"; }}
          />
        </div>
      </div>

      <div>
        <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: "6px" }}>
          Subject *
        </label>
        <select
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          style={{ ...inputStyle, color: form.subject ? "#1b1c1c" : "#9ca3af" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#003320"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,51,32,0.15)"; }}
        >
          <option value="" disabled>Select a topic</option>
          <option value="List my business">List my business</option>
          <option value="General inquiry">General inquiry</option>
          <option value="Partnership">Partnership opportunity</option>
          <option value="Technical support">Technical support</option>
          <option value="Billing">Billing question</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: "6px" }}>
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="How can we help you?"
          style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#003320"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,51,32,0.15)"; }}
        />
      </div>

      {status === "error" && (
        <p style={{ fontSize: "13px", color: "#ef4444", margin: 0 }}>
          Something went wrong. Please try again or email us directly at hello@nextcannaconnect.com.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary"
        style={{ fontSize: "13px", padding: "14px 28px", opacity: status === "loading" ? 0.7 : 1 }}
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
