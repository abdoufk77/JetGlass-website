'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminSidebar from '@/components/admin/sidebar'
import { Package, FileText, TrendingUp, Users } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalQuotes: number
  pendingQuotes: number
  monthlyRevenue: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    monthlyRevenue: 0
  })
  const [recentQuotes, setRecentQuotes] = useState([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchStats()
    fetchRecentQuotes()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const [productsRes, quotesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/quotes')
      ])

      if (productsRes.ok && quotesRes.ok) {
        const products = await productsRes.json()
        const quotes = await quotesRes.json()

        const pendingQuotes = quotes.filter((q: any) => q.status === 'PENDING').length
        const monthlyRevenue = quotes
          .filter((q: any) => {
            const quoteDate = new Date(q.createdAt)
            const now = new Date()
            return quoteDate.getMonth() === now.getMonth() && 
                   quoteDate.getFullYear() === now.getFullYear()
          })
          .reduce((sum: number, q: any) => sum + q.totalTTC, 0)

        setStats({
          totalProducts: products.length,
          totalQuotes: quotes.length,
          pendingQuotes,
          monthlyRevenue
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentQuotes = async () => {
    try {
      const response = await fetch('/api/quotes')
      if (response.ok) {
        const quotes = await response.json()
        setRecentQuotes(quotes.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching recent quotes:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'VALIDATED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'VALIDATED': return 'Validé'
      case 'REJECTED': return 'Rejeté'
      default: return status
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Vue d'ensemble de votre activité JetGlass</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Produits actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Devis total</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuotes}</div>
                <p className="text-xs text-muted-foreground">
                  Tous les devis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En attente</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
                <p className="text-xs text-muted-foreground">
                  Devis à traiter
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Recent Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>Devis récents</CardTitle>
              <CardDescription>
                Les 5 derniers devis reçus
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuotes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuotes.map((quote: any) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{quote.quoteNumber}</p>
                            <p className="text-sm text-gray-500">{quote.clientName}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                            {getStatusText(quote.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(quote.totalTTC)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun devis pour le moment</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
