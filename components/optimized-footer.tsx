'use client'

import Link from 'next/link'
import { memo } from 'react'

const FooterSection = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
))

FooterSection.displayName = 'FooterSection'

const FooterLink = memo(({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 block mb-2"
    prefetch={true}
  >
    {children}
  </Link>
))

FooterLink.displayName = 'FooterLink'

export default function OptimizedFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gradient mb-4">JetGlass</h2>
            <p className="text-gray-300 mb-4 max-w-md">
              Votre spécialiste en verrerie depuis plus de 20 ans. 
              Solutions sur mesure pour tous vos projets de vitrerie.
            </p>
            <div className="space-y-2 text-gray-300">
              <p>📍 123 Rue de la Verrerie, 75001 Maroc</p>
              <p>📞 06 23 45 67 89</p>
              <p>✉️ contact@jetglass.ma</p>
            </div>
          </div>

          {/* Quick Links */}
          <FooterSection title="Liens rapides">
            <div className="space-y-2">
              <FooterLink href="/">Accueil</FooterLink>
              <FooterLink href="/about">À propos</FooterLink>
              <FooterLink href="/produits">Produits</FooterLink>
              <FooterLink href="/projets">Projets</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </div>
          </FooterSection>

          {/* Services */}
          <FooterSection title="Services">
            <div className="space-y-2">
              <FooterLink href="/devis">Devis gratuit</FooterLink>
              <FooterLink href="/certificats">Certificats</FooterLink>
              <FooterLink href="/produits">Verres de sécurité</FooterLink>
              <FooterLink href="/produits">Double vitrage</FooterLink>
              <FooterLink href="/produits">Sur mesure</FooterLink>
            </div>
          </FooterSection>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} JetGlass. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
