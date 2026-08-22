"use client";

import { useEffect } from "react";

export default function ProfileViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/track/profile-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
