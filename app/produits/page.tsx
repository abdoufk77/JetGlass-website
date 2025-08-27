'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  reference: string
  categoryId: string
  description?: string
  active: boolean
}

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.filter((product: Product) => product.active))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Produits de Verrerie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre gamme complète de produits verriers, conçus pour répondre 
            à tous vos besoins en matière de vitrerie professionnelle et décorative.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
                    <Image
                      src="/images/produits/1.png"
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Réf: {product.reference}</p>
                    <CardDescription className="text-sm text-gray-600">
                      Catégorie: {product.categoryId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {product.description && (
                      <p className="text-gray-600 mb-4">{product.description}</p>
                    )}
                    <Button className="w-full" asChild>
                      <Link href={`/devis?product=${product.id}`}>
                        Ajouter au devis
                        <ArrowRight className="ml-2" size={16} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Aucun produit disponible
            </h3>
            <p className="text-gray-600 mb-8">
              Nos produits seront bientôt disponibles. En attendant, vous pouvez nous contacter 
              pour un devis personnalisé.
            </p>
            <Button asChild>
              <Link href="/devis">Demander un devis personnalisé</Link>
            </Button>
          </div>
        )}

        {/* Categories Section */}
        <section className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos Catégories de Produits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Verres de Sécurité',
                description: 'Verres trempés et feuilletés pour la sécurité',
                icon: '🛡️'
              },
              {
                name: 'Double Vitrage',
                description: 'Isolation thermique et acoustique optimale',
                icon: '🏠'
              },
              {
                name: 'Verres Décoratifs',
                description: 'Solutions esthétiques pour vos projets',
                icon: '🎨'
              },
              {
                name: 'Sur Mesure',
                description: 'Produits personnalisés selon vos besoins',
                icon: '📏'
              }
            ].map((category, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Besoin d'un produit spécifique ?
          </h2>
          <p className="text-gray-600 mb-6">
            Notre équipe d'experts peut créer des solutions sur mesure pour vos projets spéciaux
          </p>
          <Button size="lg" asChild>
            <Link href="/devis">
              Demander un devis personnalisé
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
