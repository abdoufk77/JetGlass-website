'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminSidebar from '@/components/admin/sidebar'
import { Save, Upload } from 'lucide-react'

interface CompanySettings {
  id?: string
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
  tvaRate: number
  conditions: string
  deliveryTerms: string
  legalNotice: string
  paymentTerms: string
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    tvaRate: 20,
    conditions: '',
    deliveryTerms: '1 semaine pour les produits standards, 4 semaines pour les produits spéciaux',
    legalNotice: 'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication',
    paymentTerms: 'Paiement à 30 jours fin de mois'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchSettings()
  }, [session, status, router])

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage('Paramètres sauvegardés avec succès')
      } else {
        setMessage('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      setMessage('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CompanySettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Paramètres de l'Entreprise</h1>
            <p className="text-gray-600">Configurez les informations de votre société</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'entreprise</CardTitle>
                <CardDescription>
                  Ces informations apparaîtront sur vos devis et documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom de l'entreprise *</label>
                    <Input
                      value={settings.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Adresse</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    value={settings.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <Input
                      value={settings.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Site web</label>
                    <Input
                      value={settings.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">URL du logo</label>
                  <Input
                    value={settings.logo || ''}
                    onChange={(e) => handleChange('logo', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quote Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres des devis</CardTitle>
                <CardDescription>
                  Configuration par défaut pour la génération des devis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Taux de TVA (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.tvaRate}
                    onChange={(e) => handleChange('tvaRate', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Modalités de paiement</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={2}
                    value={settings.paymentTerms || ''}
                    onChange={(e) => handleChange('paymentTerms', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Délais de livraison</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={2}
                    value={settings.deliveryTerms}
                    onChange={(e) => handleChange('deliveryTerms', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mention légale</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    value={settings.legalNotice}
                    onChange={(e) => handleChange('legalNotice', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('succès') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  'Sauvegarde...'
                ) : (
                  <>
                    <Save className="mr-2" size={16} />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
