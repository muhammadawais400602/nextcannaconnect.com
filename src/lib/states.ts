/**
 * US states and Canadian provinces. Listings store a mix of abbreviations
 * ("CA") and full names ("California"); search links use full names. All
 * comparisons go through toStateCode() so both forms match.
 */
export const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
  LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  PR: "Puerto Rico",
};

export const CA_PROVINCES: Record<string, string> = {
  AB: "Alberta", BC: "British Columbia", MB: "Manitoba", NB: "New Brunswick",
  NL: "Newfoundland and Labrador", NT: "Northwest Territories", NS: "Nova Scotia", NU: "Nunavut",
  ON: "Ontario", PE: "Prince Edward Island", QC: "Quebec", SK: "Saskatchewan", YT: "Yukon",
};

const ALL: Record<string, string> = { ...US_STATES, ...CA_PROVINCES };
// Keys ignore case, spaces and punctuation so "NewJersey", "new-jersey" and
// "New Jersey" all resolve to NJ.
const squash = (v: string) => v.toLowerCase().replace(/[^a-z]/g, "");
const BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(ALL).map(([code, name]) => [squash(name), code]),
);

/** "California" / "california" / "CA" / "ca" → "CA". Unknown values are returned trimmed. */
export function toStateCode(value: string | null | undefined): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  const upper = v.toUpperCase();
  if (ALL[upper]) return upper;
  return BY_NAME[squash(v)] ?? v;
}

/** "CA" → "California"; unknown values are returned as-is. */
export function stateName(value: string | null | undefined): string {
  const code = toStateCode(value);
  return ALL[code] ?? code;
}

/**
 * True if a company is located in, or says it serves, the given state.
 * "Nationwide"/"All states" in statesServed matches every US state.
 */
export function matchesState(
  company: { location?: { state?: string }; statesServed?: string[] },
  state: string,
): boolean {
  const code = toStateCode(state);
  if (!code) return true;
  if (toStateCode(company.location?.state) === code) return true;
  return (company.statesServed ?? []).some((s) => {
    if (/nationwide|all states|all 50/i.test(s)) return !!US_STATES[code];
    return toStateCode(s) === code;
  });
}

/** Unique, sorted state codes for a list of companies (for filter dropdowns). */
export function stateOptions(companies: { location?: { state?: string } }[]): string[] {
  return [...new Set(companies.map((c) => toStateCode(c.location?.state)).filter(Boolean))].sort((a, b) =>
    stateName(a).localeCompare(stateName(b)),
  );
}

/** "Denver, CO" / "Denver" / "CO" / "" — never a lone comma. */
export function formatLocation(location?: { city?: string; state?: string } | null): string {
  return [location?.city?.trim(), location?.state?.trim()].filter(Boolean).join(", ");
}
