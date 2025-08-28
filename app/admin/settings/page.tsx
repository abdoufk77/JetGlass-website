'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, Building2, Mail, Phone, MapPin, Clock, Globe, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

interface CompanySettings {
  id?: string
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
  tvaRate: number
  paymentTerms: string
  deliveryTerms: string
  legalNotice: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    workingHours: '',
    tvaRate: 20.0,
    paymentTerms: '',
    deliveryTerms: '',
    legalNotice: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setSettings(data)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setMessage('Erreur lors du chargement des paramètres')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('Paramètres sauvegardés avec succès!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof CompanySettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>

          <div className="space-y-8">
            {/* Informations générales skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Coordonnées skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <div className="h-6 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paramètres commerciaux skeleton */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-4">
                <div className="h-6 bg-gray-200 rounded w-44 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-60 animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
                    <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button skeleton */}
            <div className="flex justify-end">
              <div className="h-10 w-36 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres de l'Entreprise</h1>
          <p className="text-gray-600">
            Gérez les informations de votre entreprise qui apparaîtront sur le site web et dans les documents.
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('succès') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary-600" />
                <CardTitle>Informations Générales</CardTitle>
              </div>
              <CardDescription>
                Informations de base de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="www.exemple.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Description de votre entreprise..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Coordonnées */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary-600" />
                <CardTitle>Coordonnées</CardTitle>
              </div>
              <CardDescription>
                Informations de contact de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Adresse complète *</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  placeholder="123 Rue de la Verrerie, 69000 Lyon, France"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+33 4 78 12 34 56"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@exemple.com"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="workingHours">Horaires d'ouverture</Label>
                <Input
                  id="workingHours"
                  value={settings.workingHours}
                  onChange={(e) => handleInputChange('workingHours', e.target.value)}
                  placeholder="Lundi - Vendredi: 8h00 - 18h00, Samedi: 9h00 - 12h00"
                />
              </div>
            </CardContent>
          </Card>

          {/* Réseaux sociaux */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary-600" />
                <CardTitle>Réseaux Sociaux</CardTitle>
              </div>
              <CardDescription>
                Liens vers vos réseaux sociaux (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebookUrl">
                    <div className="flex items-center space-x-2">
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </div>
                  </Label>
                  <Input
                    id="facebookUrl"
                    value={settings.facebookUrl || ''}
                    onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/votrepage"
                  />
                </div>
                <div>
                  <Label htmlFor="twitterUrl">
                    <div className="flex items-center space-x-2">
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </div>
                  </Label>
                  <Input
                    id="twitterUrl"
                    value={settings.twitterUrl || ''}
                    onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/votrepage"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl">
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </div>
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={settings.linkedinUrl || ''}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/company/votrepage"
                  />
                </div>
                <div>
                  <Label htmlFor="instagramUrl">
                    <div className="flex items-center space-x-2">
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </div>
                  </Label>
                  <Input
                    id="instagramUrl"
                    value={settings.instagramUrl || ''}
                    onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/votrepage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres commerciaux */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Commerciaux</CardTitle>
              <CardDescription>
                Paramètres utilisés dans les devis et factures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tvaRate">Taux de TVA (%)</Label>
                <Input
                  id="tvaRate"
                  type="number"
                  step="0.1"
                  value={settings.tvaRate}
                  onChange={(e) => handleInputChange('tvaRate', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="paymentTerms">Conditions de paiement</Label>
                <Textarea
                  id="paymentTerms"
                  value={settings.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  rows={2}
                  placeholder="50% à la commande, 50% à l'enlèvement"
                />
              </div>
              <div>
                <Label htmlFor="deliveryTerms">Délais de livraison</Label>
                <Textarea
                  id="deliveryTerms"
                  value={settings.deliveryTerms}
                  onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
                  rows={2}
                  placeholder="1 semaine pour les produits standards, 4 semaines pour les produits spéciaux"
                />
              </div>
              <div>
                <Label htmlFor="legalNotice">Mentions légales</Label>
                <Textarea
                  id="legalNotice"
                  value={settings.legalNotice}
                  onChange={(e) => handleInputChange('legalNotice', e.target.value)}
                  rows={2}
                  placeholder="Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="min-w-[150px]">
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sauvegarde...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
