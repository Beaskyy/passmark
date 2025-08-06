import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates session options for the current year and 2 years back
 * @returns Array of session strings in format "YYYY/YYYY"
 * @example
 * // If current year is 2025, returns: ["2023/2024", "2024/2025", "2025/2026"]
 */
export function generateSessionOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const sessions = [];

  // Add 2 years back
  sessions.push(`${currentYear - 2}/${currentYear - 1}`);
  // Add 1 year back
  sessions.push(`${currentYear - 1}/${currentYear}`);
  // Add current year
  sessions.push(`${currentYear}/${currentYear + 1}`);

  return sessions;
}
