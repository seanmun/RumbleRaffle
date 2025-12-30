/**
 * Performance monitoring utilities for tracking Web Vitals and custom metrics
 */

export type PerformanceMetric = {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

/**
 * Report Web Vitals to analytics or monitoring service
 * Can be integrated with Google Analytics, Vercel Analytics, etc.
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance]', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    })
  }

  // In production, send to your analytics service
  // Example with Google Analytics:
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.value),
  //     metric_rating: metric.rating,
  //     metric_delta: Math.round(metric.delta),
  //     metric_id: metric.id,
  //   })
  // }

  // Example with Vercel Analytics:
  // if (window.va) {
  //   window.va('event', {
  //     name: metric.name,
  //     data: {
  //       value: metric.value,
  //       rating: metric.rating,
  //     },
  //   })
  // }
}

/**
 * Custom performance measurement utility
 * Use this to measure specific operations
 */
export class PerformanceTimer {
  private startTime: number
  private label: string

  constructor(label: string) {
    this.label = label
    this.startTime = performance.now()

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] Started: ${label}`)
    }
  }

  end(): number {
    const duration = performance.now() - this.startTime

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${this.label}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }
}

/**
 * Measure database query performance
 */
export async function measureQuery<T>(
  label: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const timer = new PerformanceTimer(`Query: ${label}`)
  const result = await queryFn()
  const duration = timer.end()

  // Warn if query takes longer than 500ms
  if (duration > 500 && process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Slow query detected: ${label} took ${duration.toFixed(2)}ms`)
  }

  return result
}

/**
 * Get performance thresholds for Web Vitals
 * Based on Google's Core Web Vitals recommendations
 */
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  LCP: {
    good: 2500,
    poor: 4000,
  },
  // First Input Delay (FID)
  FID: {
    good: 100,
    poor: 300,
  },
  // Cumulative Layout Shift (CLS)
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  // First Contentful Paint (FCP)
  FCP: {
    good: 1800,
    poor: 3000,
  },
  // Time to First Byte (TTFB)
  TTFB: {
    good: 800,
    poor: 1800,
  },
  // Interaction to Next Paint (INP)
  INP: {
    good: 200,
    poor: 500,
  },
}

/**
 * Rate a metric value based on thresholds
 */
export function rateMetric(
  name: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[name]

  if (value <= thresholds.good) {
    return 'good'
  } else if (value <= thresholds.poor) {
    return 'needs-improvement'
  } else {
    return 'poor'
  }
}
