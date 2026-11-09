/** Keyword match for directory search: name, tagline, tags and city. */
export function matchesSearch(
  c: { name?: string; shortDescription?: string; serviceTags?: string[]; location?: { city?: string } },
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [c.name, c.shortDescription, c.location?.city, ...(c.serviceTags ?? [])].join(" ").toLowerCase();
  return q.split(/\s+/).every((word) => hay.includes(word));
}
