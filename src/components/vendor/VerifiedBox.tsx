import { ShieldCheck } from "lucide-react";

interface VerifiedBoxProps {
  certifications?: string[];
  credentials?: string[];
}

export default function VerifiedBox({ certifications, credentials }: VerifiedBoxProps) {
  const items = [...(certifications || []), ...(credentials || [])];
  if (items.length === 0) return null;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "#f0faf0",
        border: "1px solid #5CB85C",
        borderLeft: "4px solid #5CB85C",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={16} style={{ color: "#5CB85C" }} />
        <h4 className="font-bold" style={{ fontSize: "13px", color: "#1A4A35", fontWeight: 700 }}>
          Verified Credentials
        </h4>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2" style={{ fontSize: "13px", color: "#1A4A35" }}>
            <span style={{ color: "#5CB85C" }}>✓</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
