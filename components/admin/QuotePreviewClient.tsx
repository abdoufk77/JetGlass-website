'use client'

import React, { useRef, useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Download, X, CheckCircle, MessageSquareWarning, Loader2 } from 'lucide-react'
import { sendQuoteActionNotification } from '@/lib/notifications'

// Define interfaces
interface Product {
  id: string;
  reference: string;
  name: string;
  basePricePerM2: number;
  complexityFactor: number;
  thicknessFactor: number;
  minPrice: number;
  thickness?: number;
}

interface QuoteProduct {
  productId: string
  product?: Product
  quantity: number
  width?: number | null
  length?: number | null
  priceHT: number
  totalHT: number
}

interface QuoteForm {
  clientName: string
  clientEmail: string
  clientPhone: string | null
  projectRef: string | null
  products: QuoteProduct[]
}

interface QuotePreviewClientProps {
  isOpen?: boolean;
  quoteData: QuoteForm;
  onClose: () => void;
  onConfirm?: (status: 'VALIDATED' | 'PENDING') => Promise<void>;
  isSubmitting?: boolean;
}

const QuotePreviewClient: React.FC<QuotePreviewClientProps> = ({ 
  quoteData, 
  onClose, 
  onConfirm,
  isSubmitting
}) => {
  const previewRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [cachetUrl, setCachetUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const settings = await response.json()
          setCachetUrl(settings?.cachetUrl || null)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des paramètres:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleDownloadPDF = async () => {
    const element = previewRef.current
    if (!element) return
    
    setIsGenerating(true)

    const originalClassName = element.className

    element.className = 'bg-white shadow-lg mx-auto w-[210mm] min-h-[297mm]'
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const imgProps = pdf.getImageProperties(imgData)
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight))
      
      pdf.save(`devis-${quoteData.projectRef || 'jetglass'}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    } finally {
      element.className = originalClassName
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold self-start sm:self-center">Aperçu du Devis</h2>
          <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-center">
            {onConfirm && (
              <>
                <Button 
                  onClick={async () => {
                    setIsValidating(true)
                    try {
                      if (quoteData.clientEmail) {
                        await sendQuoteActionNotification('temp-id-' + Date.now(), quoteData.clientEmail, 'accepted');
                      }
                      await onConfirm('VALIDATED')
                    } finally {
                      setIsValidating(false)
                    }
                  }} 
                  disabled={isValidating || isPending || isGenerating} 
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white p-2 sm:px-3"
                >
                  {isValidating ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <CheckCircle className="h-4 w-4 sm:mr-2" />}
                  <span className="hidden sm:inline">Accepter</span>
                </Button>
                <Button 
                  onClick={async () => {
                    setIsPending(true)
                    try {
                      if (quoteData.clientEmail) {
                        await sendQuoteActionNotification('temp-id-' + Date.now(), quoteData.clientEmail, 'negotiated');
                      }
                      await onConfirm('PENDING')
                    } finally {
                      setIsPending(false)
                    }
                  }} 
                  disabled={isValidating || isPending || isGenerating} 
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 sm:px-3"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <MessageSquareWarning className="h-4 w-4 sm:mr-2" />}
                  <span className="hidden sm:inline">Négocier</span>
                </Button>
              </>
            )}
            <Button onClick={handleDownloadPDF} disabled={isGenerating || isValidating || isPending} size="sm" className="p-2 sm:px-3">
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{isGenerating ? 'Génération...' : 'PDF'}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Devis Preview */}
        <div className="overflow-y-auto bg-gray-200 p-2 sm:p-4">
          <div ref={previewRef} className="bg-white shadow-lg mx-auto w-full sm:w-[210mm] sm:min-h-[297mm]">
            <div className="p-4 sm:p-8 relative text-xs sm:text-base">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-blue-300 to-blue-500"></div>
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-black">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img src="/logoo.png" alt="JetGlass Logo" className="h-12 w-12 sm:h-16 sm:w-16" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold">
                        <span className="text-black">Jet</span><span className="text-[#007bff]">Glass</span>
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-500">INDUSTRY</p>
                    </div>
                  </div>
                  <img src="/climalit.png" alt="Climalit Logo" className="h-24 sm:h-36" />
                </div>
                <div className="text-right text-[10px] sm:text-xs mt-2 sm:mt-0">
                  <p>Edité le: {new Date().toLocaleDateString('fr-FR')}</p>
                  <p>Page 1 of 1</p>
                </div>
              </header>

              {/* Info Section */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 sm:my-6 text-xs sm:text-sm">
                <div className="border border-black p-2 bg-gray-100/80">
                  <p><strong>Devis N° :</strong> D{new Date().getFullYear()}{Math.floor(1000 + Math.random() * 9000)}</p>
                  <p><strong>V/Réf :</strong> {quoteData.projectRef || 'N/A'}</p>
                  <p><strong>Projet :</strong> {quoteData.projectRef || 'N/A'}</p>
                </div>
                <div className="border border-black p-2">
                  <p><strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                  <p className="font-bold">{quoteData.clientName}</p>
                  <p>{quoteData.clientEmail}</p>
                  <p>{quoteData.clientPhone}</p>
                </div>
              </section>

              {/* Explanatory Text */}
              <p className="text-[10px] sm:text-xs text-justify mb-4">
                Nous avons l'honneur de vous remettre ci-joint nos meilleures offre de prix, vous en souhaitant bonne réception, nous espérons que notre offre retiendra votre attention et vaudra la faveur de votre ordre auquel nous apporterons nos meilleurs soins.
              </p>

              {/* Products Table */}
              <div className="border-2 border-black mb-4 overflow-x-auto">
                <table className="w-full border-collapse text-[9px] sm:text-[11px]">
                  <thead>
                    <tr className="bg-gray-200 h-8">
                      <th className="px-2 sm:px-3 py-2 border-r border-black text-center font-semibold">Référence</th>
                      <th className="px-2 sm:px-3 py-2 border-r border-black text-center font-semibold">Désignation</th>
                      <th className="px-2 sm:px-3 py-2 text-center font-semibold">Qté</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteData.products.map((item, index) => (
                      <tr key={index} className="border-t border-black min-h-[40px]">
                        <td className="px-2 sm:px-3 py-2 border-r border-black text-center align-middle">{item.product?.reference}</td>
                        <td className="px-2 sm:px-3 py-2 border-r border-black align-middle">
                          <div className="text-left">
                            <p className="font-semibold leading-tight">{item.product?.name}</p>
                            {item.width && item.length && <p className="text-gray-600 mt-1 leading-tight">Dim: ({item.width}x{item.length}cm)</p>}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-center align-middle">{item.quantity}</td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 15 - quoteData.products.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-t border-black h-10">
                        <td className="px-2 sm:px-3 py-2 border-r border-black"></td>
                        <td className="px-2 sm:px-3 py-2 border-r border-black"></td>
                        <td className="px-2 sm:px-3 py-2"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer */}
              <footer className="text-[10px] sm:text-xs">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    {cachetUrl ? (
                      <img src={cachetUrl} alt="Cachet JetGlass" className="w-24 h-20 sm:w-32 sm:h-24 object-contain opacity-80" />
                    ) : (
                      <div className="w-24 h-20 sm:w-32 sm:h-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-[10px] sm:text-xs text-gray-400">
                        Cachet entreprise
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-2"><strong>Arrêtée la présente Offre de prix à la somme de :</strong></p>
                <p className="font-bold">{/* Number to words conversion here */}</p>

                <div className="mt-2 sm:mt-4">
                  <p><strong>Mode de Paiment :</strong> 50% à la commande, 50% à l'enlevemenet.</p>
                  <p><strong>NB:</strong> Priere de verifer les dimensions chiffrées dans la présente offre de prix.</p>
                  <p><strong>Délai :</strong> La disponibilité de votre produit est prévue pour 1 semaine pour la teinte standards et 4 semaines pour la teinte spéciale, à partir de la date de la commande. Ce délai courra à compter de la réception de votre confirmation de commande et de la récep.</p>
                </div>

                <div className="text-center border-t-2 border-black mt-2 sm:mt-4 pt-2 font-mono text-[7px] sm:text-[8px]">
                  <p>RC :556029 -IF :52655219 - TP :36205859 -ICE :003104575000092 - CNSS :4651533</p>
                  <p>Casablanca Hay Hassani, Lot Diamant Vert Projet Ichrak Center Imm 16- N` B28</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuotePreviewClient
