'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function ModernLoading() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setLoading(false)
    setProgress(0)
  }, [pathname])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout

    const handleStart = () => {
      setLoading(true)
      setProgress(0)
      
      // Simulate loading progress
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 100)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
      clearInterval(progressInterval)
    }

    // Override router methods to show loading
    const originalPush = router.push
    const originalReplace = router.replace

    router.push = (...args) => {
      handleStart()
      const result = originalPush.apply(router, args)
      // Handle completion after a short delay since router.push doesn't return a promise
      setTimeout(handleComplete, 500)
      return result
    }

    router.replace = (...args) => {
      handleStart()
      const result = originalReplace.apply(router, args)
      setTimeout(handleComplete, 500)
      return result
    }

    // Listen for browser navigation
    const handlePopState = () => handleStart()
    window.addEventListener('popstate', handlePopState)

    return () => {
      clearInterval(progressInterval)
      window.removeEventListener('popstate', handlePopState)
      router.push = originalPush
      router.replace = originalReplace
    }
  }, [router])

  if (!loading) return null

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[9999] bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading overlay */}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9998] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Modern spinner */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-purple-500"></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <p className="text-gray-700 font-medium">Chargement...</p>
            <p className="text-sm text-gray-500 mt-1">Préparation de votre page</p>
          </div>
        </div>
      </div>
    </>
  )
}
