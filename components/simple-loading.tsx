'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function SimpleLoading() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Listen for link clicks
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href && !link.href.startsWith('#') && !link.target) {
        handleStart()
        setTimeout(handleComplete, 800)
      }
    }

    document.addEventListener('click', handleLinkClick)
    window.addEventListener('beforeunload', handleStart)
    window.addEventListener('load', handleComplete)

    return () => {
      document.removeEventListener('click', handleLinkClick)
      window.removeEventListener('beforeunload', handleStart)
      window.removeEventListener('load', handleComplete)
    }
  }, [])

  if (!loading) return null

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
      </div>

      {/* Loading overlay */}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9998] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Simple spinner */}
          <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          
          {/* Loading text */}
          <p className="text-gray-700 font-medium">Chargement...</p>
        </div>
      </div>
    </>
  )
}
