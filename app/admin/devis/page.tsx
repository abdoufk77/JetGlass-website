'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminSidebar from '@/components/admin/sidebar'
import { Search, Download, Eye, Edit } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Quote {
  id: string
  quoteNumber: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  projectRef?: string
  status: string
  totalHT: number
  totalTTC: number
  tva: number
  pdfPath?: string
  notes?: string
  createdAt: string
  products: Array<{
    id: string
    quantity: number
    priceHT: number
    totalHT: number
    product: {
      name: string
      reference: string
    }
  }>
}

export default function AdminQuotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchQuotes()
  }, [session, status, router])

  useEffect(() => {
    let filtered = quotes.filter(quote =>
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(quote => quote.status === statusFilter)
    }

    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, statusFilter])

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes')
      if (response.ok) {
        const data = await response.json()
        setQuotes(data)
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    }
  }

  const updateQuoteStatus = async (quoteId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      })

      if (response.ok) {
        await fetchQuotes()
        if (selectedQuote?.id === quoteId) {
          const updatedQuote = await response.json()
          setSelectedQuote(updatedQuote)
        }
      }
    } catch (error) {
      console.error('Error updating quote:', error)
    }
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

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote)
    setShowDetails(true)
  }

  const handleDownloadPDF = (quote: Quote) => {
    if (quote.pdfPath) {
      window.open(quote.pdfPath, '_blank')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Devis</h1>
            <p className="text-gray-600">Gérez et suivez tous les devis clients</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Rechercher un devis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              className="p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="VALIDATED">Validé</option>
              <option value="REJECTED">Rejeté</option>
              <option value="SENT">Envoyé</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Total: {filteredQuotes.length} devis
            </div>
          </div>

          {/* Quotes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Devis</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredQuotes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">N° Devis</th>
                        <th className="text-left p-4">Client</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Montant TTC</th>
                        <th className="text-left p-4">Statut</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotes.map((quote) => (
                        <tr key={quote.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{quote.quoteNumber}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{quote.clientName}</p>
                              <p className="text-sm text-gray-500">{quote.clientEmail}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-4 font-medium">
                            {formatPrice(quote.totalTTC)}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                              {getStatusText(quote.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(quote)}
                              >
                                <Eye size={14} />
                              </Button>
                              {quote.pdfPath && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadPDF(quote)}
                                >
                                  <Download size={14} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'ALL' 
                      ? 'Aucun devis trouvé pour ces critères' 
                      : 'Aucun devis créé'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote Details Modal */}
          {showDetails && selectedQuote && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Détails du Devis {selectedQuote.quoteNumber}</CardTitle>
                  <CardDescription>
                    Créé le {new Date(selectedQuote.createdAt).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Client Info */}
                    <div>
                      <h3 className="font-semibold mb-3">Informations Client</h3>
                      <div className="space-y-2">
                        <p><strong>Nom:</strong> {selectedQuote.clientName}</p>
                        <p><strong>Email:</strong> {selectedQuote.clientEmail}</p>
                        {selectedQuote.clientPhone && (
                          <p><strong>Téléphone:</strong> {selectedQuote.clientPhone}</p>
                        )}
                        {selectedQuote.projectRef && (
                          <p><strong>Référence projet:</strong> {selectedQuote.projectRef}</p>
                        )}
                      </div>
                    </div>

                    {/* Quote Info */}
                    <div>
                      <h3 className="font-semibold mb-3">Informations Devis</h3>
                      <div className="space-y-2">
                        <p><strong>Total HT:</strong> {formatPrice(selectedQuote.totalHT)}</p>
                        <p><strong>TVA ({selectedQuote.tva}%):</strong> {formatPrice(selectedQuote.totalHT * (selectedQuote.tva / 100))}</p>
                        <p><strong>Total TTC:</strong> {formatPrice(selectedQuote.totalTTC)}</p>
                        <div className="flex items-center space-x-2">
                          <strong>Statut:</strong>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedQuote.status)}`}>
                            {getStatusText(selectedQuote.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Produits</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 border">Référence</th>
                            <th className="text-left p-3 border">Produit</th>
                            <th className="text-left p-3 border">Quantité</th>
                            <th className="text-left p-3 border">Prix HT</th>
                            <th className="text-left p-3 border">Total HT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedQuote.products.map((item) => (
                            <tr key={item.id}>
                              <td className="p-3 border">{item.product.reference}</td>
                              <td className="p-3 border">{item.product.name}</td>
                              <td className="p-3 border">{item.quantity}</td>
                              <td className="p-3 border">{formatPrice(item.priceHT)}</td>
                              <td className="p-3 border">{formatPrice(item.totalHT)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Modifier le statut</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={selectedQuote.status === 'VALIDATED' ? 'default' : 'outline'}
                        onClick={() => updateQuoteStatus(selectedQuote.id, 'VALIDATED')}
                      >
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedQuote.status === 'REJECTED' ? 'destructive' : 'outline'}
                        onClick={() => updateQuoteStatus(selectedQuote.id, 'REJECTED')}
                      >
                        Rejeter
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedQuote.status === 'SENT' ? 'default' : 'outline'}
                        onClick={() => updateQuoteStatus(selectedQuote.id, 'SENT')}
                      >
                        Marquer comme envoyé
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedQuote.notes && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Notes</h3>
                      <p className="text-gray-600">{selectedQuote.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    {selectedQuote.pdfPath && (
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadPDF(selectedQuote)}
                      >
                        <Download className="mr-2" size={16} />
                        Télécharger PDF
                      </Button>
                    )}
                    <Button onClick={() => setShowDetails(false)}>
                      Fermer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
