/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a dedicated rate limiting service
 */

type RateLimitEntry = {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export type RateLimitConfig = {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests per interval
}

/**
 * Rate limit middleware for Next.js API routes
 * @param identifier - Unique identifier for the client (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // Clean up expired entries (simple cleanup on each call)
  if (entry && now > entry.resetTime) {
    rateLimitStore.delete(identifier)
  }

  // Get or create entry
  const currentEntry = rateLimitStore.get(identifier)

  if (!currentEntry) {
    // First request in this interval
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.interval,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.interval,
    }
  }

  // Increment counter
  currentEntry.count++

  if (currentEntry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentEntry.resetTime,
    }
  }

  return {
    allowed: true,
    remaining: config.maxRequests - currentEntry.count,
    resetTime: currentEntry.resetTime,
  }
}

/**
 * Get client identifier from request (IP address)
 * Checks various headers for the real IP address
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp.trim()
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }

  // Fallback to a generic identifier if no IP found
  return 'unknown'
}

/**
 * Clean up expired rate limit entries
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}
