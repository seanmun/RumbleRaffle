# Security Improvements

This document outlines the security enhancements implemented in the RumbleRaffle application.

## Overview

All security improvements follow OWASP best practices and focus on preventing common vulnerabilities including:
- XSS (Cross-Site Scripting)
- Injection attacks
- Rate limiting/DoS prevention
- Authentication bypass
- Input validation failures

## Implemented Security Features

### 1. Environment Variable Validation

**File:** `src/lib/env.ts`

- Uses Zod schema validation for all environment variables
- Validates at build time to catch configuration errors early
- Ensures required variables are present and properly formatted
- Type-safe environment variable access throughout the application

**Benefits:**
- Prevents runtime failures from missing/invalid configuration
- Enforces URL format validation for API endpoints
- Provides clear error messages for misconfiguration

### 2. Admin Middleware Protection

**File:** `src/lib/supabase/middleware.ts`

- Database-backed admin role verification
- Checks `is_admin` flag from users table
- Redirects non-admin users attempting to access `/admin/*` routes
- Prevents authentication bypass attacks

**Protected Routes:**
- `/admin/*` - All admin panel routes

**Benefits:**
- Row-level security at the middleware layer
- No client-side admin checks that can be bypassed
- Automatic redirect to dashboard for unauthorized access attempts

### 3. CSV Upload Security

**File:** `src/app/admin/wrestlers/page.tsx`

**Protections:**
- File size validation (max 1MB)
- File extension validation (.csv only)
- Row limit enforcement (max 1000 wrestlers per upload)
- Input sanitization for all CSV fields
- Error handling for malformed files

**Sanitization:**
- Wrestler names: Remove HTML tags and dangerous characters
- Image URLs: Protocol validation (blocks javascript:, data:, etc.)
- Gender field: Sanitized to prevent injection

**Benefits:**
- Prevents DoS attacks via large file uploads
- Blocks malicious file types
- Mitigates XSS via CSV injection
- Limits resource consumption

### 4. Rate Limiting

**File:** `src/lib/rate-limit.ts`
**Applied to:** `src/app/auth/callback/route.ts`

- In-memory rate limiting with configurable thresholds
- IP-based client identification
- Standard rate limit headers (X-RateLimit-*)
- Automatic cleanup of expired entries

**Current Limits:**
- Auth callback: 10 requests per minute per IP
- Returns 429 status code when exceeded

**Benefits:**
- Prevents brute force attacks on authentication
- Mitigates DoS/DDoS attempts
- Graceful degradation with retry-after headers
- Extensible to other API routes

### 5. XSS Protection & Input Sanitization

**File:** `src/lib/sanitize.ts`

**Sanitization Functions:**
- `sanitizeInput()` - General purpose, removes all HTML
- `sanitizeName()` - For display names, allows common punctuation
- `sanitizeUrl()` - Blocks dangerous protocols (javascript:, data:, etc.)
- `escapeHtml()` - HTML entity encoding for safe display

**Applied to:**
- User profile names (`src/app/profile/ProfileClient.tsx`)
- Wrestler names and image URLs (`src/app/admin/wrestlers/page.tsx`)
- All user-generated content before database insertion

**Benefits:**
- Prevents stored XSS attacks
- Blocks script injection via user input
- Protects against HTML injection
- Validates URLs to prevent protocol-based attacks

## Security Checklist

- [x] Environment variable validation with Zod
- [x] Admin role verification in middleware
- [x] CSV upload security (size, type, content validation)
- [x] Rate limiting on API routes
- [x] XSS protection via input sanitization
- [x] SQL injection protection (via Supabase parameterized queries)
- [x] Authentication on protected routes
- [x] HTTPS enforcement (via Next.js config)

## Additional Recommendations

### For Production Deployment:

1. **Rate Limiting**
   - Consider using Redis for distributed rate limiting
   - Add rate limiting to all public API endpoints
   - Implement different tiers (e.g., 60/min for auth, 1000/min for data)

2. **Content Security Policy (CSP)**
   - Add CSP headers to prevent inline script execution
   - Configure allowed script sources
   - Enable report-only mode first, then enforce

3. **Monitoring & Logging**
   - Add Sentry or similar error tracking
   - Log security events (failed auth, rate limit hits)
   - Monitor for suspicious patterns

4. **Database Security**
   - Review Supabase Row Level Security (RLS) policies
   - Ensure all tables have appropriate RLS enabled
   - Audit database permissions regularly

5. **Dependencies**
   - Regular dependency updates
   - Use `npm audit` to scan for vulnerabilities
   - Enable Dependabot or similar automated scanning

6. **HTTPS & Transport Security**
   - Enforce HTTPS in production
   - Add HSTS headers
   - Configure secure cookie flags

## Testing Security Features

### Manual Testing:

1. **Admin Protection:**
   - Try accessing `/admin` without login → redirects to `/login`
   - Try accessing `/admin` as non-admin user → redirects to `/dashboard`
   - Verify admin can access all admin routes

2. **Rate Limiting:**
   - Make 11+ rapid requests to `/auth/callback` → receives 429 error
   - Wait 1 minute → requests succeed again

3. **Input Sanitization:**
   - Try entering `<script>alert('xss')</script>` in name field → sanitized
   - Try entering `javascript:alert('xss')` in image URL → blocked

4. **CSV Upload:**
   - Upload >1MB file → rejected
   - Upload .txt file → rejected
   - Upload CSV with >1000 rows → rejected

## Security Contact

For security concerns or vulnerability reports, please contact the development team.

## Version History

- **2025-12-29**: Initial security implementation
  - Environment validation
  - Admin middleware
  - CSV upload security
  - Rate limiting
  - XSS protection
