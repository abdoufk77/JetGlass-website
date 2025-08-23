import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Award, Shield, CheckCircle, Star } from 'lucide-react'

export default function CertificatsPage() {
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
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <CardTitle>Qualibat RGE</CardTitle>
                <CardDescription>Reconnu Garant de l'Environnement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Certification garantissant notre expertise en rénovation énergétique et notre engagement environnemental.
                </p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Valide jusqu'en 2025</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <CardTitle>ISO 9001</CardTitle>
                <CardDescription>Management de la Qualité</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Système de management qualité certifié pour garantir la satisfaction client et l'amélioration continue.
                </p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Certifié depuis 2018</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Star className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <CardTitle>CSTB</CardTitle>
                <CardDescription>Centre Scientifique et Technique du Bâtiment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Certification technique pour l'installation de systèmes verriers conformes aux normes du bâtiment.
                </p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Agréé CSTB</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Award className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <CardTitle>FFB</CardTitle>
                <CardDescription>Fédération Française du Bâtiment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Membre actif de la FFB, garantissant le respect des règles professionnelles et déontologiques.
                </p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Membre depuis 2010</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <CardTitle>Assurance Décennale</CardTitle>
                <CardDescription>Protection Totale</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Couverture complète de nos installations pendant 10 ans pour votre tranquillité d'esprit.
                </p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Couverture 5M€</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Star className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <CardTitle>Formation Continue</CardTitle>
                <CardDescription>Expertise Actualisée</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Formation régulière de nos équipes aux dernières techniques et normes de sécurité.
                </p>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">40h/an par technicien</span>
                </div>
              </CardContent>
            </Card>

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
    </div>
  )
}
