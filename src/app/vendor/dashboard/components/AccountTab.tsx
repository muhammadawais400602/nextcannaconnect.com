"use client";

import { useState } from "react";
import Link from "next/link";
import { TIER_LABELS, TIER_COLORS, inputStyle, labelStyle, cardStyle, sectionTitle } from "./shared";
import type { VendorUser } from "./shared";

export default function AccountTab({
  vendor,
  onLogout,
}: {
  vendor: VendorUser;
  onLogout: () => void;
}) {
  const tierLabel = TIER_LABELS[vendor.tier] ?? "Unclaimed";
  const tierStyle = TIER_COLORS[vendor.tier] ?? TIER_COLORS.free;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    setPwError("");

    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setPwMsg("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div>
      {/* Current Plan */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Current Plan</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span
            style={{
              padding: "5px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 700,
              background: tierStyle.bg,
              color: tierStyle.color,
            }}
          >
            {tierLabel}
          </span>
          {vendor.tier !== "elite" && (
            <Link
              href="/membership"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "white",
                background: "#1A4A35",
                padding: "6px 16px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Upgrade Plan →
            </Link>
          )}
        </div>

        {vendor.tier === "free" && (
          <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: "8px", padding: "14px 16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#92400E", margin: "0 0 6px" }}>
              Unlock more features
            </p>
            <p style={{ fontSize: "12px", color: "#92400E", margin: 0, lineHeight: 1.5 }}>
              Upgrade to Select ($49.99/mo) to add social links, gallery images, and make your listing details public.
              Or go Verified Pro ($99/mo) for video embeds, unlimited photos, and priority placement.
            </p>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Change Password</h2>
        <form onSubmit={handleChangePassword} style={{ maxWidth: "400px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              style={inputStyle}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              style={inputStyle}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              style={inputStyle}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            disabled={pwSaving}
            style={{
              padding: "10px 24px",
              background: "#1A4A35",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: pwSaving ? "not-allowed" : "pointer",
              opacity: pwSaving ? 0.7 : 1,
            }}
          >
            {pwSaving ? "Saving..." : "Change Password"}
          </button>
          {pwMsg && <p style={{ color: "#16A34A", fontSize: "12px", marginTop: "8px" }}>{pwMsg}</p>}
          {pwError && <p style={{ color: "#DC2626", fontSize: "12px", marginTop: "8px" }}>{pwError}</p>}
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{ ...cardStyle, borderColor: "#FCA5A5" }}>
        <h2 style={{ ...sectionTitle, color: "#DC2626", borderBottomColor: "#FEE2E2" }}>Danger Zone</h2>
        <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "14px" }}>
          Permanently remove your listing from the directory. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            padding: "8px 20px",
            background: "white",
            color: "#DC2626",
            border: "1px solid #FCA5A5",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Delete My Listing
        </button>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "28px",
              maxWidth: "400px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#DC2626", margin: "0 0 12px" }}>
              Delete Listing?
            </h3>
            <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, marginBottom: "20px" }}>
              This will permanently remove your listing from the NextCanna Connect directory.
              Your account will remain active but your company page will no longer be visible.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "8px 18px",
                  background: "white",
                  color: "#6B7280",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 18px",
                  background: "#DC2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowDeleteModal(false);
                  onLogout();
                }}
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
