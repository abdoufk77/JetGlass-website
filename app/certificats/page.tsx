'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Award, Shield, CheckCircle, X } from 'lucide-react'

const certifications = [
  {
    title: 'Attestation CTIBA double vitrage',
    description: "Certification pour l'installation de double vitrage.",
    icon: <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />,
    image: '/images/Attestation/Attestation CTIBA double vitrage.png'
  },
  {
    title: 'Attestation CTIBA verre feuilleté',
    description: 'Certification pour la pose de verre feuilleté de sécurité.',
    icon: <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />,
    image: '/images/Attestation/Attestation CTIBA verre feuilleté.png'
  },
  {
    title: 'Attestation Conformité collage',
    description: 'Conformité pour les techniques de collage structurel.',
    icon: <CheckCircle className="h-16 w-16 text-primary-600 mx-auto mb-4" />,
    image: '/images/Attestation/Attestation Conformité collage.png'
  }
];

export default function CertificatsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsLoading(true)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Certifications
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              La qualité et la sécurité au cœur de notre démarche professionnelle
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => openModal(cert.image)}
              >
                <CardHeader className="text-center">
                  {cert.icon}
                  <CardTitle>{cert.title}</CardTitle>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Cliquez pour voir l'attestation.
                  </p>
                  <div className="flex items-center text-green-600 justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Valide</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Standards Qualité</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des processus rigoureux pour garantir l'excellence de nos prestations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Audit Initial</h3>
              <p className="text-gray-600 text-sm">
                Évaluation complète de vos besoins et contraintes techniques
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Conception</h3>
              <p className="text-gray-600 text-sm">
                Plans détaillés et validation technique selon les normes en vigueur
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Réalisation</h3>
              <p className="text-gray-600 text-sm">
                Installation par nos équipes certifiées avec contrôles qualité
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Suivi</h3>
              <p className="text-gray-600 text-sm">
                Maintenance préventive et service après-vente garanti
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre Sécurité, Notre Priorité</h2>
              <p className="text-gray-600">
                Toutes nos certifications sont vérifiables et régulièrement auditées
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
                <p className="text-gray-600">Installations conformes aux normes</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
                <p className="text-gray-600">Accident sur nos chantiers en 2023</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">10 ans</div>
                <p className="text-gray-600">Garantie décennale sur tous nos travaux</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Une Expertise Certifiée
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Faites confiance à nos 20 ans d'expérience et nos certifications reconnues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/devis">Demander un devis</Link>
            </Button>
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" 
          onClick={closeModal}
        >
          <div 
            className="relative bg-white p-2 rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] flex items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            )}
            <Image 
              src={selectedImage} 
              alt="Attestation en plein écran" 
              width={1200} 
              height={1600} 
              className={`object-contain w-full h-full max-h-[90vh] transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsLoading(false)}
            />
            <button 
              onClick={closeModal} 
              className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-110"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
