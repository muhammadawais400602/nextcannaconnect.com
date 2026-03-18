import { ShieldCheck, CheckCircle } from "lucide-react";

interface VerifiedBoxProps {
  certifications?: string[];
  credentials?: string[];
}

export default function VerifiedBox({ certifications, credentials }: VerifiedBoxProps) {
  const items = [...(certifications || []), ...(credentials || [])];
  if (items.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: "36px", height: "36px", backgroundColor: "rgba(92,184,92,0.1)" }}
        >
          <ShieldCheck size={18} style={{ color: "#5CB85C" }} />
        </div>
        <h4 className="font-bold" style={{ fontSize: "14px", color: "#111827", fontWeight: 700 }}>
          Verified Credentials
        </h4>
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#5CB85C" }} />
            <span style={{ fontSize: "13px", color: "#374151" }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
