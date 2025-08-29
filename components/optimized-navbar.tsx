'use client'

import Link from 'next/link'
import { useState, useCallback, memo } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

const NavLink = memo(({ href, children, onClick, isActive }: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  isActive?: boolean
}) => (
  <Link 
    href={href} 
    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive 
        ? 'text-primary-600 border-b-2 border-primary-600' 
        : 'text-gray-700 hover:text-primary-600'
    }`}
    onClick={onClick}
    prefetch={true}
  >
    {children}
  </Link>
))

NavLink.displayName = 'NavLink'

const MobileNavLink = memo(({ href, children, onClick }: {
  href: string
  children: React.ReactNode
  onClick: () => void
}) => (
  <Link
    href={href}
    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
    onClick={onClick}
    prefetch={true}
  >
    {children}
  </Link>
))

MobileNavLink.displayName = 'MobileNavLink'

export default function OptimizedNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    { href: '/produits', label: 'Produits' },
    { href: '/certificats', label: 'Certificats' },
    { href: '/projets', label: 'Projets' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink 
                key={item.href} 
                href={item.href}
                isActive={pathname === item.href}
              >
                {item.label}
              </NavLink>
            ))}
            <Link href="/devis" prefetch={true}>
              <Button asChild size="sm" className="ml-4">
                Demander Devis
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navItems.map((item) => (
              <MobileNavLink 
                key={item.href} 
                href={item.href} 
                onClick={closeMenu}
              >
                {item.label}
              </MobileNavLink>
            ))}
            <MobileNavLink href="/devis" onClick={closeMenu}>
              Devis
            </MobileNavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
