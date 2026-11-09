"use client";

import { useSearchParams } from "next/navigation";
import { stateName, toStateCode } from "@/lib/states";

/**
 * Hero stat that follows the directory's state filter: "2,871 Listed
 * Cultivators" → "847 cultivators in California". The grid keeps ?state= in the
 * URL; counts are precomputed on the server with the same matching rules.
 */
export default function HeroListedCount({
  total,
  counts,
  noun,
}: {
  total: number;
  counts: Record<string, number>;
  noun: string;
}) {
  const code = toStateCode(useSearchParams().get("state"));
  if (!code) return <>{total.toLocaleString()} Listed {noun}</>;
  return (
    <>
      {(counts[code] ?? 0).toLocaleString()} {noun.toLowerCase()} in {stateName(code)}
    </>
  );
}
