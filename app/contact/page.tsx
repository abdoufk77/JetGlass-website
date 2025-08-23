import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, MessageSquare, Calendar } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contactez-Nous
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Nos Coordonnées</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-primary-600" />
                      <CardTitle className="text-lg">Adresse</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      123 Rue de la Verrerie<br />
                      69000 Lyon, France
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-6 w-6 text-primary-600" />
                      <CardTitle className="text-lg">Téléphone</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">+33 4 78 12 34 56</p>
                    <p className="text-sm text-gray-500">Du lundi au vendredi, 8h-18h</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-6 w-6 text-primary-600" />
                      <CardTitle className="text-lg">Email</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">contact@jetglass.fr</p>
                    <p className="text-sm text-gray-500">Réponse sous 24h</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-primary-600" />
                      <CardTitle className="text-lg">Horaires</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-gray-600">
                      <p>Lundi - Vendredi: 8h00 - 18h00</p>
                      <p>Samedi: 9h00 - 12h00</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Envoyez-nous un Message</h2>
              
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <Input id="firstName" type="text" required />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <Input id="lastName" type="text" required />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input id="email" type="email" required />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input id="phone" type="tel" />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Entreprise
                      </label>
                      <Input id="company" type="text" />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <select 
                        id="subject" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="devis">Demande de devis</option>
                        <option value="info">Demande d'information</option>
                        <option value="sav">Service après-vente</option>
                        <option value="partenariat">Partenariat</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea 
                        id="message"
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Décrivez votre projet ou votre demande..."
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input 
                        id="consent" 
                        type="checkbox" 
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        required
                      />
                      <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                        J'accepte que mes données soient utilisées pour me recontacter *
                      </label>
                    </div>

                    <Button type="submit" className="w-full">
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choisissez l'option qui correspond le mieux à votre besoin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Demande de Devis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Obtenez un devis personnalisé pour votre projet en quelques minutes
                </CardDescription>
                <Button asChild className="w-full">
                  <Link href="/devis">Faire un devis</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Planifiez une visite de nos experts sur votre site
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Prendre RDV
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Phone className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <CardTitle>Appel Urgent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Besoin d'une réponse immédiate ? Appelez-nous directement
                </CardDescription>
                <Button variant="outline" className="w-full">
                  <a href="tel:+33478123456">04 78 12 34 56</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nous Trouver</h2>
            <p className="text-gray-600">
              Notre showroom et nos ateliers sont situés au cœur de Lyon
            </p>
          </div>

          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Carte Interactive</p>
              <p className="text-sm">123 Rue de la Verrerie, 69000 Lyon</p>
              <p className="text-sm mt-2">
                <a href="https://maps.google.com" className="text-primary-600 hover:underline">
                  Voir sur Google Maps
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
            <p className="text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quel est le délai moyen pour un devis ?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nous nous engageons à vous fournir un devis détaillé sous 48h pour les projets standards. 
                  Pour les projets complexes, le délai peut être de 5 à 7 jours ouvrés.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposez-vous un service de dépannage ?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Oui, nous avons un service de dépannage d'urgence disponible 24h/24 et 7j/7 
                  pour nos clients. Contactez-nous au 04 78 12 34 56.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dans quelles régions intervenez-vous ?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nous intervenons principalement en région Auvergne-Rhône-Alpes, 
                  mais nous pouvons étudier des projets dans toute la France selon leur ampleur.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quelle garantie offrez-vous ?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nous offrons une garantie de 10 ans sur nos installations et 2 ans sur la main d'œuvre. 
                  Nos produits sont également couverts par les garanties fabricants.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
