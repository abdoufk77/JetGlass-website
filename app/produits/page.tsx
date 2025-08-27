import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProduitsPage() {
  const products = await getProducts()

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
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src="/images/produits/1.png" 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
