/**
 * Security utilities for sanitizing user input
 * Prevents XSS attacks by removing potentially dangerous characters
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes HTML tags, script tags, and potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers (onclick, onerror, etc.)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:/gi, '')
    // Trim whitespace
    .trim()
}

/**
 * Sanitize display name (more lenient than general sanitization)
 * Allows common punctuation but removes dangerous characters
 */
export function sanitizeName(name: string): string {
  if (!name) return ''

  return name
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove special characters that could be used for injection
    .replace(/[<>"'`]/g, '')
    // Trim whitespace
    .trim()
    // Limit length
    .substring(0, 100)
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(url: string): string {
  if (!url) return ''

  const trimmed = url.trim()

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = trimmed.toLowerCase()

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return ''
    }
  }

  return trimmed
}

/**
 * Escape HTML special characters to prevent XSS when displaying user content
 * Use this when you need to display user-generated content as-is
 */
export function escapeHtml(text: string): string {
  if (!text) return ''

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char)
}
