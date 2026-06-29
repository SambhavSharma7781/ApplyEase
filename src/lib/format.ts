// Shared formatting + deterministic styling helpers used across the UI.

/**
 * Format a numeric salary with Indian digit grouping, e.g. 1800000 -> "₹18,00,000".
 * Returns null for missing / non-positive values so callers can skip rendering.
 */
export function formatSalary(salary?: number | null): string | null {
    if (salary === undefined || salary === null || isNaN(salary) || salary <= 0) {
        return null;
    }
    return `₹${Math.round(salary).toLocaleString("en-IN")}`;
}

// Tasteful, accessible logo color palettes (bg + text) keyed by a stable index.
const LOGO_PALETTES = [
    { bg: "bg-blue-600", ring: "ring-blue-100" },
    { bg: "bg-violet-600", ring: "ring-violet-100" },
    { bg: "bg-emerald-600", ring: "ring-emerald-100" },
    { bg: "bg-amber-500", ring: "ring-amber-100" },
    { bg: "bg-rose-600", ring: "ring-rose-100" },
    { bg: "bg-cyan-600", ring: "ring-cyan-100" },
    { bg: "bg-indigo-600", ring: "ring-indigo-100" },
    { bg: "bg-teal-600", ring: "ring-teal-100" },
];

/**
 * Deterministically map a company name to a stable palette so each company
 * keeps a distinct, consistent logo color across the app.
 */
export function companyColor(name: string): { bg: string; ring: string } {
    let hash = 0;
    const str = name || "?";
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // force 32-bit
    }
    const index = Math.abs(hash) % LOGO_PALETTES.length;
    return LOGO_PALETTES[index];
}

/** First character of a name, uppercased, with a safe fallback. */
export function initial(name?: string | null): string {
    return (name?.trim()?.charAt(0) || "?").toUpperCase();
}
