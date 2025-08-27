'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function ElegantLoading() {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && !link.href.startsWith('#') && !link.target) {
        const url = new URL(link.href)
        if (url.pathname !== pathname && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
          setIsNavigating(true)
          // Auto-hide after reasonable time
          setTimeout(() => setIsNavigating(false), 1000)
        }
      }
    }

    document.addEventListener('click', handleNavigation)
    return () => document.removeEventListener('click', handleNavigation)
  }, [pathname])

  return (
    <>
      {/* Minimal top progress bar - only 2px height */}
      <div className={`fixed top-0 left-0 h-0.5 z-[9999] transition-all duration-700 ease-out ${
        isNavigating ? 'w-full' : 'w-0'
      }`}>
        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-sm opacity-80" />
      </div>

    </>
  )
}
