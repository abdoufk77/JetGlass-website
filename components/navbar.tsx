'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-gradient">JetGlass</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Accueil
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              À propos
            </Link>
            <Link href="/produits" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Produits
            </Link>
            <Link href="/certificats" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Certificats
            </Link>
            <Link href="/projets" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Projets
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Contact
            </Link>
            <Button asChild>
              <Link href="/devis">Devis</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="/produits"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Produits
              </Link>
              <Link
                href="/certificats"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Certificats
              </Link>
              <Link
                href="/projets"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Projets
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/devis"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Devis
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
