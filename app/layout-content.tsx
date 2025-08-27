'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import EnhancedNavbar from '@/components/enhanced-navbar'
import Footer from '@/components/footer'
import ElegantLoading from '@/components/elegant-loading'
import { ErrorBoundary } from '@/components/error-boundary'
import { PerformanceMonitor } from '@/components/performance-monitor'

function PageSkeleton() {
  return (
    <div className="animate-pulse min-h-screen">
      <div className="h-64 bg-gray-200 mb-8"></div>
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    return <>{children}</>
  }

  return (
    <ErrorBoundary>
      <PerformanceMonitor />
      <ElegantLoading />
      <EnhancedNavbar />
      <Suspense fallback={<PageSkeleton />}>
        <main className="min-h-screen">
          {children}
        </main>
      </Suspense>
      <Footer />
    </ErrorBoundary>
  )
}
