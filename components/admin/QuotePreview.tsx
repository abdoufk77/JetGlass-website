'use client'

import React, { useRef, useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Download, X, Save, CheckCircle, MessageSquareWarning, Loader2, Send } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { sendQuoteActionNotification } from '@/lib/notifications'

// Define interfaces based on NewQuotePage
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

interface Totals {
  totalHT: number
  tva: number
  totalTTC: number
}

interface QuotePreviewProps {
  isOpen?: boolean;
  quoteData: QuoteForm;
  onClose: () => void;
  onSave?: () => Promise<void>;
  mode?: 'create' | 'view';
  isClientView?: boolean;
  isAdminView?: boolean;
  onAccept?: () => Promise<void>;
  onNegotiate?: () => Promise<void>;
  quoteId?: string;
  quoteStatus?: string;
  onConfirm?: (status: 'VALIDATED' | 'PENDING') => Promise<void>;
  onCreateAndSend?: () => Promise<void>;
  isSubmitting?: boolean;
}

const QuotePreview: React.FC<QuotePreviewProps> = ({ 
  quoteData, 
  onClose, 
  onSave, 
  mode = 'create', 
  isClientView = false,
  isAdminView = false,
  onAccept,
  onNegotiate,
  quoteId,
  quoteStatus,
  onConfirm,
  onCreateAndSend,
  isSubmitting
}) => {
  const totals = {
    totalHT: quoteData.products.reduce((acc, item) => acc + (item.totalHT || 0), 0),
    tva: quoteData.products.reduce((acc, item) => acc + (item.totalHT || 0), 0) * 0.2,
    totalTTC: quoteData.products.reduce((acc, item) => acc + (item.totalHT || 0), 0) * 1.2
  };
  const previewRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isCreatingAndSending, setIsCreatingAndSending] = useState(false)
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
    if (!previewRef.current) return
    setIsGenerating(true)

    const canvas = await html2canvas(previewRef.current, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Fit the image to the page width
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add the image, ensuring it doesn't exceed the page height
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
    
    pdf.save(`devis-${quoteData.projectRef || 'jetglass'}.pdf`)
    setIsGenerating(false)
  }
  
  const handleSaveQuote = async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await onSave()
    } catch (error) {
      console.error('Failed to save quote:', error)
      // Optionally, show an error to the user
    } finally {
      setIsSaving(false)
      onClose() // Close modal after saving
    }
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 font-sans">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold self-start sm:self-center">Aperçu du Devis</h2>
                    <div className="flex items-center space-x-2 self-end sm:self-center">
            {isClientView ? (
              <div className="flex items-center space-x-2">
                {quoteStatus === 'PENDING' && (
                  <>
                    <Button 
                      onClick={onAccept} 
                      disabled={isAccepting || isNegotiating || isGenerating}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      {isAccepting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2" size={16} />}
                      Accepter
                    </Button>
                    <Button 
                      onClick={onNegotiate} 
                      disabled={isAccepting || isNegotiating || isGenerating}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      size="sm"
                    >
                      {isNegotiating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareWarning className="mr-2" size={16} />}
                      Négocier
                    </Button>
                  </>
                )}
                <Button onClick={handleDownloadPDF} disabled={isGenerating || isAccepting || isNegotiating} size="sm">
                  <Download className="mr-2" size={16} />
                  {isGenerating ? 'Génération...' : 'Télécharger PDF'}
                </Button>
              </div>
            ) : (
              <>
                {/* Boutons pour admin */}
                {isAdminView && mode === 'create' && onCreateAndSend && (
                  <>
                    <Button 
                      onClick={async () => {
                        setIsCreatingAndSending(true)
                        try {
                          await onCreateAndSend()
                        } finally {
                          setIsCreatingAndSending(false)
                        }
                      }} 
                      disabled={isCreatingAndSending || isGenerating} 
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isCreatingAndSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2" size={16} />}
                      {isCreatingAndSending ? 'Envoi...' : 'Créer et Envoyer par Email'}
                    </Button>
                  </>
                )}
                
                {/* Boutons pour client */}
                {!isAdminView && mode === 'create' && onConfirm && (
                  <>
                    <Button 
                      onClick={async () => {
                        setIsValidating(true)
                        try {
                          // Envoyer notification email pour acceptation
                          if (quoteData.clientEmail) {
                            try {
                              await sendQuoteActionNotification(
                                'temp-id-' + Date.now(), 
                                quoteData.clientEmail, 
                                'accepted'
                              );
                              console.log('📧 Email de notification envoyé - Devis accepté');
                            } catch (emailError) {
                              console.error('Erreur email:', emailError);
                            }
                          }
                          await onConfirm('VALIDATED')
                        } finally {
                          setIsValidating(false)
                        }
                      }} 
                      disabled={isValidating || isPending || isGenerating} 
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {isValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2" size={16} />}
                      Accepter
                    </Button>
                    <Button 
                      onClick={async () => {
                        setIsPending(true)
                        try {
                          // Envoyer notification email pour négociation
                          if (quoteData.clientEmail) {
                            try {
                              await sendQuoteActionNotification(
                                'temp-id-' + Date.now(), 
                                quoteData.clientEmail, 
                                'negotiated'
                              );
                              console.log('📧 Email de notification envoyé - Négociation demandée');
                            } catch (emailError) {
                              console.error('Erreur email:', emailError);
                            }
                          }
                          await onConfirm('PENDING')
                        } finally {
                          setIsPending(false)
                        }
                      }} 
                      disabled={isValidating || isPending || isGenerating} 
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquareWarning className="mr-2" size={16} />}
                      Négocier
                    </Button>
                  </>
                )}
                
                {mode === 'create' && onSave && !isAdminView && (
                  <Button onClick={handleSaveQuote} disabled={isSaving || isGenerating} size="sm">
                    <Save className="mr-2" size={16} />
                    {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                  </Button>
                )}
                <Button onClick={handleDownloadPDF} disabled={isGenerating || isSaving || isCreatingAndSending} size="sm">
                  <Download className="mr-2" size={16} />
                  {isGenerating ? 'Génération...' : 'PDF'}
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Devis Preview */}
        <div className="overflow-y-auto bg-gray-200 p-4">
          <div ref={previewRef} className="bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
            <div className="p-8 relative">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-300 to-blue-500"></div>
              <header className="flex justify-between items-center pb-4 border-b-2 border-black">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/logoo.png" alt="JetGlass Logo" className="h-16 w-16" />
                    <div>
                      <h3 className="text-2xl font-bold">
                        <span className="text-black">Jet</span><span className="text-[#007bff]">Glass</span>
                      </h3>
                      <p className="text-sm font-semibold tracking-widest text-gray-500">INDUSTRY</p>
                    </div>
                  </div>
                  <img src="/climalit.png" alt="Climalit Logo" className="h-36" />
                </div>
                <div className="text-right">
                  <p className="text-xs">Edité le: {new Date().toLocaleDateString('fr-FR')}</p>
                  <p className="text-xs">Page 1 of 1</p>
                </div>
              </header>

              {/* Info Section */}
              <section className="grid grid-cols-2 gap-4 my-6 text-sm">
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
              <p className="text-xs text-justify mb-4">
                Nous avons l'honneur de vous remettre ci-joint nos meilleures offre de prix, vous en souhaitant bonne réception, nous espérons que notre offre retiendra votre attention et vaudra la faveur de votre ordre auquel nous apporterons nos meilleurs soins.
              </p>

              {/* Products Table */}
              <div className="border-2 border-black mb-4">
                <table className="w-full border-collapse" style={{ fontSize: '11px' }}>
                  <thead>
                    <tr className="bg-gray-200" style={{ height: '32px' }}>
                      <th className="px-3 py-2 border-r border-black text-center font-semibold">Référence</th>
                      <th className="px-3 py-2 border-r border-black text-center font-semibold">Désignation</th>
                      <th className="px-3 py-2 border-r border-black text-center font-semibold">Qté</th>
                      <th className="px-3 py-2 border-r border-black text-center font-semibold">Total M²</th>
                      <th className="px-3 py-2 border-r border-black text-center font-semibold">PU</th>
                      <th className="px-3 py-2 text-center font-semibold">Total (HT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteData.products.map((item, index) => {
                      const surface = (item.width && item.length) ? (item.width * item.length) / 10000 : 0;
                      return (
                        <tr key={index} className="border-t border-black" style={{ minHeight: '40px' }}>
                          <td className="px-3 py-3 border-r border-black text-center align-middle">{item.product?.reference}</td>
                          <td className="px-3 py-3 border-r border-black align-middle">
                            <div className="text-left">
                              <p className="font-semibold leading-tight">{item.product?.name}</p>
                              {item.width && item.length && <p className="text-gray-600 mt-1 leading-tight">Dim: ({item.width}x{item.length}cm)</p>}
                            </div>
                          </td>
                          <td className="px-3 py-3 border-r border-black text-center align-middle">{item.quantity}</td>
                          <td className="px-3 py-3 border-r border-black text-center align-middle">{formatPrice(surface * item.quantity)}</td>
                          <td className="px-3 py-3 border-r border-black text-center align-middle">{formatPrice(item.priceHT)}</td>
                          <td className="px-3 py-3 text-center align-middle font-semibold">{formatPrice(item.totalHT)}</td>
                        </tr>
                      )
                    })}
                    {/* Add empty rows to fill the table */}
                    {Array.from({ length: Math.max(0, 15 - quoteData.products.length) }).map((_, i) => (
                      <tr key={`empty-${i}`} className="border-t border-black" style={{ height: '40px' }}>
                        <td className="px-3 py-3 border-r border-black"></td>
                        <td className="px-3 py-3 border-r border-black"></td>
                        <td className="px-3 py-3 border-r border-black"></td>
                        <td className="px-3 py-3 border-r border-black"></td>
                        <td className="px-3 py-3 border-r border-black"></td>
                        <td className="px-3 py-3"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer */}
              <footer className="text-xs">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    {cachetUrl ? (
                      <img src={cachetUrl} alt="Cachet JetGlass" className="w-32 h-24 object-contain opacity-80" />
                    ) : (
                      <div className="w-32 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                        Cachet entreprise
                      </div>
                    )}
                  </div>
                  <div className="border-2 border-black w-80">
                    <div className="flex justify-between px-4 py-2 border-b border-black">
                      <span className="font-medium">TOTAL HT</span>
                      <span className="font-bold text-right">{formatPrice(totals.totalHT)}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2 border-b border-black">
                      <span className="font-medium">TVA 20%</span>
                      <span className="font-bold text-right">{formatPrice(totals.tva)}</span>
                    </div>
                    <div className="flex justify-between px-4 py-3 bg-gray-200">
                      <span className="font-bold">Montant Total Net TTC</span>
                      <span className="font-bold text-right">{formatPrice(totals.totalTTC)}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-2"><strong>Arrêtée la présente Offre de prix à la somme de :</strong></p>
                {/* TODO: Add number to words conversion */}
                <p className="font-bold">{/* Number to words conversion here */}</p>

                <div className="mt-4">
                  <p><strong>Mode de Paiment :</strong> 50% à la commande, 50% à l'enlevemenet.</p>
                  <p><strong>NB:</strong> Priere de verifer les dimensions chiffrées dans la présente offre de prix.</p>
                  <p><strong>Délai :</strong> La disponibilité de votre produit est prévue pour 1 semaine pour la teinte standards et 4 semaines pour la teinte spéciale, à partir de la date de la commande. Ce délai courra à compter de la réception de votre confirmation de commande et de la récep.</p>
                </div>

                <div className="text-center border-t-2 border-black mt-4 pt-2 font-mono text-[8px]">
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

export default QuotePreview
