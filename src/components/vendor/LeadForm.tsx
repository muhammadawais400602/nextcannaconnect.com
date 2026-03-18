"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface LeadFormProps {
  companyName: string;
  serviceTags: string[];
}

export default function LeadForm({ companyName, serviceTags }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    state: "",
    services: [] as string[],
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
      >
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-full"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "rgba(92,184,92,0.1)",
          }}
        >
          <CheckCircle size={28} style={{ color: "#5CB85C" }} />
        </div>
        <h3 className="font-bold mb-2" style={{ fontSize: "17px", color: "#111827", fontWeight: 700 }}>
          Inquiry Sent!
        </h3>
        <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>
          {companyName} will receive your message and reach out shortly.
        </p>
      </div>
    );
  }

  const fieldStyle = {
    width: "100%",
    padding: "10px 13px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#111827",
    backgroundColor: "#F8FAF8",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
    >
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: "1px solid #E5E7EB", backgroundColor: "#F8FAF8" }}
      >
        <h3 className="font-bold" style={{ fontSize: "15px", color: "#111827", fontWeight: 700 }}>
          Connect with {companyName}
        </h3>
        <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "3px" }}>
          Send a direct inquiry — usually responded to within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3">
          <input
            required
            type="text"
            placeholder="Your Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={fieldStyle}
          />
          <input
            required
            type="text"
            placeholder="Company Name *"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={fieldStyle}
          />
          <input
            required
            type="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={fieldStyle}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={fieldStyle}
          />
          <input
            type="text"
            placeholder="State / Province"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            style={fieldStyle}
          />
        </div>

        {/* Services */}
        {serviceTags.length > 0 && (
          <div>
            <p
              className="uppercase tracking-wider mb-2"
              style={{ fontSize: "11px", color: "#9CA3AF", letterSpacing: "1px", fontWeight: 600 }}
            >
              Services of Interest
            </p>
            <div className="flex flex-col gap-2">
              {serviceTags.slice(0, 4).map((tag) => (
                <label key={tag} className="flex items-center gap-2.5 cursor-pointer">
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
                    style={{ accentColor: "#F7941D", width: "14px", height: "14px" }}
                  />
                  <span style={{ fontSize: "13px", color: "#374151" }}>{tag}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <textarea
          placeholder="Your message..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="resize-none"
          style={fieldStyle}
        />

        <button
          type="submit"
          className="btn-primary w-full justify-center mt-1"
          style={{ fontSize: "14px", padding: "12px" }}
        >
          <Send size={14} />
          Send Inquiry
        </button>

        <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center" }}>
          Your info is never shared without your permission.
        </p>
      </form>
    </div>
  );
}
