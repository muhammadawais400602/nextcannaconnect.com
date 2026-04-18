"use client";
import { useEffect, useState } from "react";
import CustomSelect from "@/components/ui/CustomSelect";

const TIER_COLORS: Record<string, string> = {
  elite: "#1A4A35", select: "#2563EB", claimed: "#7C3AED", free: "#6B7280",
};
const TIER_BG: Record<string, string> = {
  elite: "#E8F5EE", select: "#EFF6FF", claimed: "#F5F3FF", free: "#F9FAFB",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = Record<string, any>;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setEmpty(!data.users || data.users.length === 0);
        setLoading(false);
      })
      .catch(() => {
        setEmpty(true);
        setLoading(false);
      });
  }, []);

  async function handleTierChange(id: string, tier: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tier }),
    });
    if (res.ok) {
      const { user } = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? user : u)));
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0D2818", margin: 0, fontFamily: "sans-serif" }}>
          Users
        </h1>
        <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px", fontFamily: "sans-serif" }}>
          Registered vendors and buyers
        </p>
      </div>

      <div
        style={{
          background: "white", borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "sans-serif" }}>
            Loading users...
          </div>
        ) : empty ? (
          <div style={{ padding: "60px", textAlign: "center", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
              No users yet
            </p>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
              Users will appear here once they sign up on the platform.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Name", "Email", "Company", "Type", "Tier", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px", textAlign: "left", fontSize: "11px",
                      fontWeight: "700", color: "#6B7280", textTransform: "uppercase",
                      letterSpacing: "0.05em", fontFamily: "sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          background: "#1A4A35", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "12px", fontWeight: "700",
                          color: "white", fontFamily: "sans-serif", flexShrink: 0,
                        }}
                      >
                        {u.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827", fontFamily: "sans-serif" }}>
                        {u.fullName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>
                    {u.companyName || "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: "600", textTransform: "capitalize",
                        color: u.accountType === "vendor" ? "#1A4A35" : "#2563EB",
                        background: u.accountType === "vendor" ? "#E8F5EE" : "#EFF6FF",
                        padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif",
                      }}
                    >
                      {u.accountType}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: "700", textTransform: "capitalize",
                        color: TIER_COLORS[u.tier] || "#6B7280",
                        background: TIER_BG[u.tier] || "#F9FAFB",
                        padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif",
                      }}
                    >
                      {u.tier}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <CustomSelect
                      value={u.tier}
                      onChange={(e) => handleTierChange(u._id, e.target.value)}
                      style={{ fontSize: "12px", padding: "6px 28px 6px 10px" }}
                    >
                      {["free", "claimed", "select", "elite"].map((t) => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </CustomSelect>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
