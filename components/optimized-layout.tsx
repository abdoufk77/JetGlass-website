'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import OptimizedNavbar from '@/components/optimized-navbar'
import Footer from '@/components/footer'
import LoadingIndicator from '@/components/loading-indicator'

function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 mb-4"></div>
      <div className="space-y-4 p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function OptimizedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    return <>{children}</>
  }

  return (
    <>
      <LoadingIndicator />
      <OptimizedNavbar />
      <Suspense fallback={<PageSkeleton />}>
        <main className="min-h-screen">
          {children}
        </main>
      </Suspense>
      <Footer />
    </>
  )
}
