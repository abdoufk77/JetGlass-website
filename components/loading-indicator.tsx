'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function LoadingIndicator() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Listen for route changes
    const originalPush = window.history.pushState
    const originalReplace = window.history.replaceState

    window.history.pushState = function(...args) {
      handleStart()
      originalPush.apply(window.history, args)
    }

    window.history.replaceState = function(...args) {
      handleStart()
      originalReplace.apply(window.history, args)
    }

    window.addEventListener('popstate', handleStart)

    return () => {
      window.history.pushState = originalPush
      window.history.replaceState = originalReplace
      window.removeEventListener('popstate', handleStart)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-loading-bar"></div>
      </div>
    </div>
  )
}
