'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function SubtleLoading() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(false)
    setProgress(0)
  }, [pathname])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout

    const handleStart = () => {
      setLoading(true)
      setProgress(0)
      
      // Smooth progress animation
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) return prev
          return prev + Math.random() * 10
        })
      }, 150)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 300)
      clearInterval(progressInterval)
    }

    // Listen for navigation events
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href && !link.href.startsWith('#') && !link.target && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
        const url = new URL(link.href)
        if (url.pathname !== pathname) {
          handleStart()
          setTimeout(handleComplete, 600)
        }
      }
    }

    document.addEventListener('click', handleLinkClick)

    return () => {
      document.removeEventListener('click', handleLinkClick)
      clearInterval(progressInterval)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-[9999]">
      <div 
        className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 transition-all duration-300 ease-out shadow-sm"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
        }}
      />
    </div>
  )
}
