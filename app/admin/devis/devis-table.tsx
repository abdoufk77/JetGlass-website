'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Download, Eye, Edit, Trash2, FileText, ChevronLeft, ChevronRight, Save, Plus, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Quote, QuoteProduct, Product } from '@prisma/client'
import QuotePreview from '@/components/admin/QuotePreview'
import { useToast, toast } from '@/components/ui/toast'

type FullQuote = Quote & {
  products: (QuoteProduct & { product: Product })[];
}

interface DevisTableProps {
  quotes: FullQuote[];
}

export default function DevisTable({ quotes }: DevisTableProps) {
  const { addToast } = useToast()
  const [filteredQuotes, setFilteredQuotes] = useState<FullQuote[]>(quotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedQuote, setSelectedQuote] = useState<FullQuote | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null)

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

  const handleViewDetails = async (quote: FullQuote) => {
    setIsPreviewLoading(true)
    setShowPreview(true)
    try {
      const response = await fetch(`/api/quotes/${quote.id}`)
      if (response.ok) {
        const fullQuoteData = await response.json()
        setSelectedQuote(fullQuoteData)
      } else {
        console.error('Failed to fetch quote details')
        setShowPreview(false)
      }
    } catch (error) {
      console.error('Error fetching quote details:', error)
      setShowPreview(false)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleDownloadPDF = (quote: FullQuote) => {
    if (quote.pdfPath) {
      window.open(quote.pdfPath, '_blank')
    }
  }

  const handleGeneratePDF = async (quote: FullQuote) => {
    setIsGeneratingPDF(quote.id)
    try {
      const response = await fetch(`/api/quotes/${quote.id}/pdf`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        // Refresh the page or update the quote with the new PDF path
        window.location.reload()
        addToast(toast.success(
          'PDF généré',
          'Le PDF du devis a été généré avec succès'
        ))
      } else {
        addToast(toast.error(
          'Erreur de génération',
          'Impossible de générer le PDF du devis'
        ))
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      addToast(toast.error(
        'Erreur de connexion',
        'Impossible de communiquer avec le serveur'
      ))
    } finally {
      setIsGeneratingPDF(null)
    }
  }

  const handleDelete = async (quote: FullQuote) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le devis ${quote.quoteNumber} ?`)) {
      try {
        const response = await fetch(`/api/quotes/${quote.id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          window.location.reload()
          addToast(toast.success(
            'Devis supprimé',
            `Le devis ${quote.quoteNumber} a été supprimé avec succès`
          ))
        } else {
          addToast(toast.error(
            'Erreur de suppression',
            'Impossible de supprimer ce devis'
          ))
        }
      } catch (error) {
        console.error('Error deleting quote:', error)
        addToast(toast.error(
          'Erreur de connexion',
          'Impossible de communiquer avec le serveur'
        ))
      }
    }
  }

  const handleEdit = (quote: FullQuote) => {
    window.location.href = `/admin/devis/edit/${quote.id}`
  }


  // Pagination logic
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
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
        </select>

        <div className="text-sm text-gray-600 flex items-center justify-end">
          <span className="font-medium">{filteredQuotes.length}</span>&nbsp;devis trouvé{filteredQuotes.length > 1 ? 's' : ''}
          {totalPages > 1 && (
            <span className="ml-4">Page {currentPage} sur {totalPages}</span>
          )}
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
              {currentQuotes.length > 0 ? (
                currentQuotes.map((quote) => (
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
                          title="Voir le devis"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(quote)}
                          title="Modifier"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(quote)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </Button>
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Précédent
                </Button>
                <Button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Suivant
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredQuotes.length)}</span> sur{' '}
                    <span className="font-medium">{filteredQuotes.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        onClick={() => goToPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quote Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {isPreviewLoading || !selectedQuote ? (
            <div className="text-white flex items-center">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              Chargement du devis...
            </div>
          ) : (
            <QuotePreview
              isOpen={showPreview}
              quoteData={{
                ...selectedQuote,
                products: selectedQuote.products.map(p => ({ ...p, product: p.product }))
              }}
              onClose={() => {
                setShowPreview(false)
                setSelectedQuote(null)
              }}
              mode="view"
            />
          )}
        </div>
      )}


    </>
  )
}
