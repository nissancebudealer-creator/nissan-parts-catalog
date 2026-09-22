/**
 * Security & Input Sanitization Utilities
 * Implements Section 13 security practices (input validation, sanitization, XSS mitigation).
 */

/**
 * Sanitizes arbitrary text input by trimming and stripping HTML/script tags.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }
  return input
    .trim()
    .replace(/[<>]/g, "") // Strip raw tag brackets
    .slice(0, 500); // Enforce max string length bounds
}

/**
 * Validates and sanitizes automotive part numbers (alphanumeric + hyphen/underscore).
 */
export function sanitizePartNumber(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\-_]/g, "")
    .slice(0, 50);
}

/**
 * Validates model year integer within reasonable bounds.
 */
export function validateYear(yearInput: unknown): number | null {
  const parsed = typeof yearInput === "number" ? yearInput : parseInt(String(yearInput), 10);
  if (isNaN(parsed) || parsed < 1980 || parsed > 2050) {
    return null;
  }
  return parsed;
}

/**
 * Basic rate-limiter check placeholder / request validator.
 */
export function validateApiOrigin(allowedOrigins: string[], currentOrigin?: string | null): boolean {
  if (!currentOrigin) return true; // same-origin
  return allowedOrigins.some((allowed) => currentOrigin.startsWith(allowed));
}
