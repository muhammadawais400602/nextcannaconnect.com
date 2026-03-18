"use client";

import { useState } from "react";

interface FiltersPanelProps {
  categoryLabel: string;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export default function FiltersPanel({ categoryLabel }: FiltersPanelProps) {
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [licenseType, setLicenseType] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState("");

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #E8EDE8",
    borderRadius: "6px",
    fontSize: "13px",
    color: "#1A2E1A",
    backgroundColor: "white",
    outline: "none",
  };

  return (
    <div
      className="rounded-xl p-5 sticky top-20"
      style={{ backgroundColor: "white", border: "1px solid #E8EDE8" }}
    >
      <h3
        className="font-bold mb-4"
        style={{ fontSize: "14px", color: "#1A4A35", fontWeight: 700, borderBottom: "2px solid #F7941D", paddingBottom: "8px" }}
      >
        Filters
      </h3>

      {/* Location */}
      <div className="mb-4">
        <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
          Location
        </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        >
          <option value="">All States</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Service Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
          Service Type
        </label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Services</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="consulting">Consulting</option>
          <option value="distribution">Distribution</option>
          <option value="software">Software</option>
        </select>
      </div>

      {/* License Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
          License Type
        </label>
        <select
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All License Types</option>
          <option value="cultivator">Cultivator</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="distributor">Distributor</option>
          <option value="retailer">Retailer</option>
          <option value="testing">Testing Lab</option>
        </select>
      </div>

      {/* Verified only */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="verified-only"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          style={{ accentColor: "#F7941D", width: "15px", height: "15px" }}
        />
        <label
          htmlFor="verified-only"
          className="cursor-pointer"
          style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 500 }}
        >
          Verified Companies Only
        </label>
      </div>

      {/* Search within category */}
      <div className="mb-2">
        <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
          Search within {categoryLabel}
        </label>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>
  );
}
