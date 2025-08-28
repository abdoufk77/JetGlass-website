import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminSidebar from '@/components/admin/sidebar'
import { Package, FileText, Users } from 'lucide-react'
import { getDashboardStats, getRecentQuotes } from '@/lib/data'
import { Quote } from '@prisma/client'

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

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentQuotes = await getRecentQuotes()

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
                  {recentQuotes.map((quote: Quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
