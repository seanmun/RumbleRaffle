import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

export async function GET(request: Request) {
  // Security: Apply rate limiting to prevent abuse
  const identifier = getClientIdentifier(request)
  const { allowed, remaining, resetTime } = rateLimit(identifier, {
    interval: 60000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  })

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        resetTime: new Date(resetTime).toISOString(),
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
        },
      }
    )
  }

  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  const response = NextResponse.redirect(new URL(redirect, requestUrl.origin))

  // Add rate limit headers to response
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', resetTime.toString())

  return response
}
