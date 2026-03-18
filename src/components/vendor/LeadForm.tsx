"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface LeadFormProps {
  companyName: string;
  serviceTags: string[];
}

export default function LeadForm({ companyName, serviceTags }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", state: "", services: [] as string[], message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ backgroundColor: "#5CB85C", color: "white" }}
      >
        <div
          className="mx-auto mb-3 flex items-center justify-center rounded-full font-bold text-2xl"
          style={{ width: "56px", height: "56px", backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          ✓
        </div>
        <h3 className="font-bold text-lg mb-1">Inquiry Sent!</h3>
        <p style={{ fontSize: "14px", opacity: 0.9 }}>
          {companyName} will receive your message and reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: "#1A4A35" }}
    >
      <h3 className="font-bold text-white mb-4" style={{ fontSize: "16px", fontWeight: 700 }}>
        Let&apos;s Connect
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          required
          type="text"
          placeholder="Your Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg px-3 py-2.5"
          style={{ fontSize: "13px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
        />
        <input
          required
          type="text"
          placeholder="Company Name *"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="rounded-lg px-3 py-2.5"
          style={{ fontSize: "13px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
        />
        <input
          required
          type="email"
          placeholder="Email Address *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg px-3 py-2.5"
          style={{ fontSize: "13px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-lg px-3 py-2.5"
          style={{ fontSize: "13px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
        />
        <input
          type="text"
          placeholder="State / Province"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="rounded-lg px-3 py-2.5"
          style={{ fontSize: "13px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
        />

        {/* Service checkboxes */}
        <div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Services of Interest
          </p>
          <div className="flex flex-col gap-1.5">
            {serviceTags.slice(0, 4).map((tag) => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.services.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({ ...form, services: [...form.services, tag] });
                    } else {
                      setForm({ ...form, services: form.services.filter((s) => s !== tag) });
                    }
                  }}
                  style={{ accentColor: "#F7941D" }}
                />
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>{tag}</span>
              </label>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Message..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          className="rounded-lg px-3 py-2.5 resize-none"
          style={{ fontSize: "13px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
        />

        <button type="submit" className="btn-primary w-full justify-center" style={{ marginTop: "4px" }}>
          <Send size={14} />
          Submit Inquiry
        </button>
      </form>
    </div>
  );
}
