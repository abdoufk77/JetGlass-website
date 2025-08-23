import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building, Home, Store, Factory } from 'lucide-react'

export default function ProjetsPage() {
  const projects = [
    {
      id: 1,
      title: "Centre Commercial Atlantis",
      category: "Commercial",
      description: "Façade vitrée de 2000m² avec système de ventilation intégré",
      image: "/images/slider-1.jpg",
      year: "2023",
      location: "Paris",
      icon: Store
    },
    {
      id: 2,
      title: "Résidence Les Jardins",
      category: "Résidentiel",
      description: "Baies vitrées sur mesure pour 45 appartements haut de gamme",
      image: "/images/slider-2.jpg",
      year: "2023",
      location: "Lyon",
      icon: Home
    },
    {
      id: 3,
      title: "Siège Social TechCorp",
      category: "Bureaux",
      description: "Mur-rideau innovant avec verres autonettoyants",
      image: "/images/slider-3.jpg",
      year: "2022",
      location: "Marseille",
      icon: Building
    },
    {
      id: 4,
      title: "Usine Pharmaceutique",
      category: "Industriel",
      description: "Cloisons vitrées stériles pour salles blanches",
      image: "/images/slider-1.jpg",
      year: "2022",
      location: "Toulouse",
      icon: Factory
    },
    {
      id: 5,
      title: "Hôtel Prestige",
      category: "Hôtellerie",
      description: "Verrière d'accueil et façades panoramiques",
      image: "/images/slider-2.jpg",
      year: "2021",
      location: "Nice",
      icon: Building
    },
    {
      id: 6,
      title: "Villa Moderne",
      category: "Résidentiel",
      description: "Baies coulissantes XXL et véranda sur mesure",
      image: "/images/slider-3.jpg",
      year: "2021",
      location: "Cannes",
      icon: Home
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Projets
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Découvrez quelques-unes de nos réalisations les plus remarquables
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center mb-16">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <p className="text-gray-600">Projets réalisés</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500,000</div>
              <p className="text-gray-600">m² de verre installé</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
              <p className="text-gray-600">Clients satisfaits</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">20</div>
              <p className="text-gray-600">Années d'expérience</p>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const IconComponent = project.icon
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }}>
                    <div className="h-full bg-black bg-opacity-40 flex items-end p-4">
                      <div className="text-white">
                        <span className="bg-primary-600 px-2 py-1 rounded text-xs font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {project.location} • {project.year}
                        </CardDescription>
                      </div>
                      <IconComponent className="h-6 w-6 text-primary-600 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Domaines d'Expertise</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous intervenons dans tous les secteurs avec la même exigence de qualité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Commercial</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Centres commerciaux, boutiques, showrooms avec solutions vitrées sur mesure
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Home className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Résidentiel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Maisons individuelles, appartements, vérandas et extensions vitrées
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Store className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Bureaux</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Immeubles de bureaux, sièges sociaux, espaces de coworking modernes
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Factory className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Industriel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Usines, entrepôts, laboratoires avec contraintes techniques spécifiques
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Processus</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              De l'idée à la réalisation, nous vous accompagnons à chaque étape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Étude</h3>
              <p className="text-gray-600 text-sm">
                Analyse de vos besoins et étude de faisabilité technique
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Conception</h3>
              <p className="text-gray-600 text-sm">
                Plans détaillés, modélisation 3D et validation du projet
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fabrication</h3>
              <p className="text-gray-600 text-sm">
                Production sur mesure dans nos ateliers avec contrôles qualité
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Installation</h3>
              <p className="text-gray-600 text-sm">
                Pose par nos équipes certifiées et réception de l'ouvrage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Votre Projet Nous Intéresse
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Parlons de votre vision et donnons-lui vie ensemble
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/devis">Demander un devis</Link>
            </Button>
            <Button size="lg" asChild className="bg-white text-primary-600 hover:bg-gray-100">
              <Link href="/contact">Discuter de mon projet</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
