import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Award, Users, Clock, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À propos de JetGlass
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Depuis plus de 20 ans, nous sommes votre partenaire de confiance pour tous vos projets de verrerie
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
              <p className="text-gray-600 mb-4">
                Fondée en 2003, JetGlass est née de la passion de créer des solutions vitrées d'exception. 
                Notre entreprise familiale a grandi en gardant ses valeurs fondamentales : qualité, innovation et service client.
              </p>
              <p className="text-gray-600 mb-4">
                Aujourd'hui, nous sommes reconnus comme l'un des leaders de la verrerie sur mesure, 
                avec plus de 10 000 projets réalisés et une équipe de 25 professionnels expérimentés.
              </p>
              <p className="text-gray-600">
                Notre expertise couvre tous les domaines : du simple vitrage aux façades complexes, 
                en passant par les créations artistiques les plus audacieuses.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Nos Chiffres</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Années d'expérience</span>
                  <span className="font-bold text-primary-600">20+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projets réalisés</span>
                  <span className="font-bold text-primary-600">10 000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clients satisfaits</span>
                  <span className="font-bold text-primary-600">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Équipe</span>
                  <span className="font-bold text-primary-600">25 experts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ce qui nous guide dans chacun de nos projets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nous visons l'excellence dans chaque détail, de la conception à la réalisation
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Proximité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Un accompagnement personnalisé et une relation de confiance avec nos clients
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Réactivité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Des délais respectés et une disponibilité constante pour vos projets
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Fiabilité</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Des solutions durables avec garantie et service après-vente de qualité
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des professionnels passionnés à votre service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
                <CardTitle>Direction</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Une direction expérimentée qui guide l'entreprise vers l'excellence depuis 20 ans
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-12 w-12 text-primary-600" />
                </div>
                <CardTitle>Artisans Verriers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  15 artisans qualifiés maîtrisant toutes les techniques de travail du verre
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-12 w-12 text-primary-600" />
                </div>
                <CardTitle>Support Client</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Une équipe dédiée pour vous accompagner de la conception à la maintenance
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Travaillons ensemble
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Découvrez comment notre expertise peut donner vie à vos projets
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
