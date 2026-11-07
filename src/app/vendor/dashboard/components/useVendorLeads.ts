"use client";

import { useEffect, useState } from "react";

export interface VendorInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceNeeded?: string;
  message?: string;
  source?: string;
  createdAt: string;
}

export interface VendorLeadStats {
  views30: number;
  viewsTotal: number;
  inquiries30: number;
  inquiriesTotal: number;
  viewsByDay: { date: string; count: number }[];
}

export function useVendorLeads() {
  const [inquiries, setInquiries] = useState<VendorInquiry[]>([]);
  const [stats, setStats] = useState<VendorLeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vendor/leads")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        setInquiries(data.inquiries ?? []);
        setStats(data.stats ?? null);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { inquiries, stats, loading, error };
}
