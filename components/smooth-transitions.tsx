'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function SmoothTransitions() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // End transition when route changes
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [pathname, isTransitioning])

  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.href && !link.href.startsWith('#') && !link.target) {
        const url = new URL(link.href)
        if (url.pathname !== pathname && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
          setIsTransitioning(true)
        }
      }
    }

    document.addEventListener('click', handleLinkClick)
    return () => document.removeEventListener('click', handleLinkClick)
  }, [pathname])

  return (
    <>
      {/* Subtle top progress bar */}
      <div className={`fixed top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 z-[9999] transition-all duration-500 ease-out ${
        isTransitioning ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`} />
      
      {/* Page transition overlay */}
      <div className={`fixed inset-0 bg-white pointer-events-none z-[9998] transition-opacity duration-300 ${
        isTransitioning ? 'opacity-20' : 'opacity-0'
      }`} />
    </>
  )
}
