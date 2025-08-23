'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

interface CompanySettings {
  name: string
  address: string
  phone: string
  email: string
  website: string
  description: string
  facebookUrl?: string
  twitterUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  workingHours: string
}

export default function Footer() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  // Fallback values if settings are not loaded
  const displaySettings = settings || {
    name: 'JetGlass',
    address: '123 Rue de la Verrerie, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@jetglass.fr',
    description: 'Votre spécialiste en verrerie depuis plus de 20 ans. Nous proposons des solutions sur mesure pour tous vos projets de vitrerie.',
    workingHours: 'Lundi - Vendredi: 8h00 - 18h00'
  }

  return (
    <footer className="bg-glass-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">{displaySettings.name}</h3>
            <p className="text-gray-300 mb-4">
              {displaySettings.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span className="text-sm">{displaySettings.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-sm">{displaySettings.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-sm">{displaySettings.email}</span>
              </div>
              {displaySettings.workingHours && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Horaires:</span>
                  <span className="text-sm">{displaySettings.workingHours}</span>
                </div>
              )}
            </div>
            
            {/* Social Media Links */}
            {(settings?.facebookUrl || settings?.twitterUrl || settings?.linkedinUrl || settings?.instagramUrl) && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Suivez-nous</h4>
                <div className="flex space-x-3">
                  {settings?.facebookUrl && (
                    <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                      <Facebook size={20} />
                    </a>
                  )}
                  {settings?.twitterUrl && (
                    <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                      <Twitter size={20} />
                    </a>
                  )}
                  {settings?.linkedinUrl && (
                    <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                      <Linkedin size={20} />
                    </a>
                  )}
                  {settings?.instagramUrl && (
                    <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                      <Instagram size={20} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nos Produits</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/produits" className="hover:text-white">Verres de sécurité</Link></li>
              <li><Link href="/produits" className="hover:text-white">Verres trempés</Link></li>
              <li><Link href="/produits" className="hover:text-white">Double vitrage</Link></li>
              <li><Link href="/produits" className="hover:text-white">Verres décoratifs</Link></li>
              <li><Link href="/produits" className="hover:text-white">Verres sur mesure</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/devis" className="hover:text-white">Devis</Link></li>
              <li><Link href="/" className="hover:text-white">Installation</Link></li>
              <li><Link href="/" className="hover:text-white">Maintenance</Link></li>
              <li><Link href="/" className="hover:text-white">Conseil technique</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 {displaySettings.name}. Tous droits réservés. | 
            <Link href="#" className="hover:text-white ml-1">Mentions légales</Link> | 
            <Link href="#" className="hover:text-white ml-1">Politique de confidentialité</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
