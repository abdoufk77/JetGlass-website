'use client'

import { useEffect } from 'react'

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
        }
        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any // LayoutShift interface not widely supported yet
          if (!clsEntry.hadRecentInput) {
            console.log('CLS:', clsEntry.value)
          }
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.log('Performance monitoring not fully supported')
    }

    return () => observer.disconnect()
  }, [])

  return null
}
