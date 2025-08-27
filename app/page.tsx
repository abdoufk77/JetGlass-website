import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Zap, Award, Users, ArrowRight, CheckCircle } from 'lucide-react'
import OptimizedHeroSlider from '@/components/optimized-hero-slider'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Slider Section */}
      <OptimizedHeroSlider />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir JetGlass ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre expertise et notre engagement qualité font de nous le partenaire idéal pour vos projets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-primary-600" size={32} />
                </div>
                <CardTitle className="text-xl">Qualité Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Matériaux de haute qualité et finitions irréprochables pour tous nos produits
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-primary-600" size={32} />
                </div>
                <CardTitle className="text-xl">Rapidité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Délais respectés : 1 semaine pour le standard, 4 semaines pour le sur-mesure
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-primary-600" size={32} />
                </div>
                <CardTitle className="text-xl">Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Plus de 20 ans d'expérience dans la verrerie et la vitrerie professionnelle
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary-600" size={32} />
                </div>
                <CardTitle className="text-xl">Service Client</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Accompagnement personnalisé et conseil technique pour chaque projet
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nos services de verrerie
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                De la conception à l'installation, nous vous accompagnons dans tous vos projets 
                de vitrerie avec des solutions adaptées à vos besoins spécifiques.
              </p>
              
              <div className="space-y-4">
                {[
                  'Verres de sécurité et trempés',
                  'Double vitrage haute performance',
                  'Verres décoratifs et sur mesure',
                  'Installation et maintenance',
                  'Conseil technique personnalisé'
                ].map((service, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-primary-600 flex-shrink-0" size={20} />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/produits">
                    Découvrir nos produits
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Devis gratuit en 24h
                </h3>
                <p className="text-gray-600 mb-6">
                  Obtenez rapidement un devis personnalisé pour votre projet. 
                  Notre équipe d'experts vous répond sous 24h.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="text-primary-600" size={16} />
                    <span className="text-sm">Devis détaillé et transparent</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="text-primary-600" size={16} />
                    <span className="text-sm">Conseil technique inclus</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="text-primary-600" size={16} />
                    <span className="text-sm">Sans engagement</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/devis">Demander mon devis</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins en verrerie
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/devis">Demander un devis</Link>
            </Button>
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="tel:0123456789">Appeler maintenant</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
