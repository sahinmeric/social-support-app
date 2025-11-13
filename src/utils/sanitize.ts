import type { ApplicationFormData } from "../types/form.types";

/**
 * Options for sanitizing input
 */
export interface SanitizeOptions {
  allowHtml?: boolean;
  maxLength?: number;
  trim?: boolean;
}

/**
 * Sanitize a single input string to prevent injection attacks
 * while preserving legitimate special characters
 */
export const sanitizeInput = (
  input: string,
  options: SanitizeOptions = {}
): string => {
  const { allowHtml = false, maxLength, trim = true } = options;

  let sanitized = input;

  // Trim whitespace if requested
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Remove HTML tags if not allowed
  if (!allowHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, "");
  }

  // Remove potentially dangerous characters while preserving legitimate ones
  // Remove script-related characters but keep apostrophes, hyphens, etc.
  sanitized = sanitized
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "") // Remove iframe tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers (onclick, onerror, etc.)
    .replace(/[<>]/g, ""); // Remove angle brackets

  // Limit length if specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Sanitize all string fields in form data
 */
export const sanitizeFormData = (
  data: Partial<ApplicationFormData>
): Partial<ApplicationFormData> => {
  const sanitized: Partial<ApplicationFormData> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      // Sanitize string fields
      sanitized[key as keyof ApplicationFormData] = sanitizeInput(value) as any;
    } else {
      // Keep non-string fields as-is (numbers, dates, etc.)
      sanitized[key as keyof ApplicationFormData] = value as any;
    }
  }

  return sanitized;
};
