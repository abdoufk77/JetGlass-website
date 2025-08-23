import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-glass-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">JetGlass</h3>
            <p className="text-gray-300 mb-4">
              Votre spécialiste en verrerie depuis plus de 20 ans. 
              Nous proposons des solutions sur mesure pour tous vos projets de vitrerie.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span className="text-sm">123 Rue de la Verrerie, 75001 Paris</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-sm">01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-sm">contact@jetglass.fr</span>
              </div>
            </div>
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
              <li><Link href="/devis" className="hover:text-white">Devis gratuit</Link></li>
              <li><Link href="/" className="hover:text-white">Installation</Link></li>
              <li><Link href="/" className="hover:text-white">Maintenance</Link></li>
              <li><Link href="/" className="hover:text-white">Conseil technique</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 JetGlass. Tous droits réservés. | 
            <Link href="#" className="hover:text-white ml-1">Mentions légales</Link> | 
            <Link href="#" className="hover:text-white ml-1">Politique de confidentialité</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
