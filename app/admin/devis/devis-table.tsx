'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Download, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Quote, QuoteProduct, Product } from '@prisma/client'

type FullQuote = Quote & {
  products: (QuoteProduct & { product: Product })[];
}

interface DevisTableProps {
  quotes: FullQuote[];
}

export default function DevisTable({ quotes }: DevisTableProps) {
  const [filteredQuotes, setFilteredQuotes] = useState<FullQuote[]>(quotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedQuote, setSelectedQuote] = useState<FullQuote | null>(null)
  const [showDetails, setShowDetails] = useState(false)

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

  const handleViewDetails = (quote: FullQuote) => {
    setSelectedQuote(quote)
    setShowDetails(true)
  }

  const handleDownloadPDF = (quote: FullQuote) => {
    if (quote.pdfPath) {
      window.open(quote.pdfPath, '_blank')
    }
  }

  return (
    <>
      {/* Search and Filters */}
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
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="VALIDATED">Validé</option>
          <option value="REJECTED">Rejeté</option>
          <option value="SENT">Envoyé</option>
        </select>

        <div className="text-sm text-gray-600 flex items-center justify-end">
          <span className="font-medium">{filteredQuotes.length}</span>&nbsp;devis trouvé{filteredQuotes.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Devis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant TTC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quote.quoteNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.clientName}</div>
                        <div className="text-sm text-gray-500">{quote.clientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(quote.totalTTC)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'ALL' 
                        ? 'Aucun devis trouvé pour ces critères' 
                        : 'Aucun devis créé'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Référence
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantité
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prix HT
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total HT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedQuote.products.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.product.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPrice(item.priceHT)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatPrice(item.totalHT)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

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
    </>
  )
}
