'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Trash2, Save, FileText } from 'lucide-react'
import Link from 'next/link'
import QuotePreview from '@/components/admin/QuotePreview'
import { useToast, toast } from '@/components/ui/toast'

interface Product {
  id: string
  reference: string
  name: string
  basePricePerM2: number
  complexityFactor: number
  thicknessFactor: number
  minPrice: number
  dimensions?: string
  categoryId: string
  category?: { name: string }
  active: boolean
}

interface QuoteProduct {
  productId: string
  product?: Product
  quantity: number
  width?: number
  length?: number
  thickness?: number
  priceHT: number
  totalHT: number
}

interface QuoteForm {
  clientName: string
  clientEmail: string
  clientPhone: string
  projectRef: string
  notes: string
  products: QuoteProduct[]
}

export default function NewQuotePage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState<QuoteForm>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    projectRef: '',
    notes: '',
    products: []
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.filter((p: Product) => p.active))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        productId: '',
        quantity: 1,
        width: 0,
        length: 0,
        thickness: 6,
        priceHT: 0,
        totalHT: 0
      }]
    }))
  }

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }))
  }

  const updateProduct = (index: number, field: keyof QuoteProduct, value: any) => {
    setFormData(prev => {
      const newProducts = [...prev.products]
      const product = { ...newProducts[index] }
      
      if (field === 'productId') {
        const selectedProduct = products.find(p => p.id === value)
        product.product = selectedProduct
        product.productId = value
        
        // Calculate price based on product and dimensions
        if (selectedProduct && product.width && product.length) {
          const surface = (product.width * product.length) / 10000 // Convert cm² to m²
          const thicknessFactor = product.thickness ? Math.max(1, product.thickness / 6) : 1
          const calculatedPrice = Math.max(
            selectedProduct.basePricePerM2 * surface * selectedProduct.complexityFactor * thicknessFactor,
            selectedProduct.minPrice
          )
          product.priceHT = calculatedPrice
          product.totalHT = calculatedPrice * product.quantity
        }
      } else {
        (product as any)[field] = value
        
        // Recalculate price if dimensions or quantity change
        if (['width', 'length', 'thickness', 'quantity'].includes(field) && product.product) {
          const surface = (product.width! * product.length!) / 10000
          const thicknessFactor = product.thickness ? Math.max(1, product.thickness / 6) : 1
          const calculatedPrice = Math.max(
            product.product.basePricePerM2 * surface * product.product.complexityFactor * thicknessFactor,
            product.product.minPrice
          )
          product.priceHT = calculatedPrice
          product.totalHT = calculatedPrice * product.quantity
        }
        
        if (field === 'priceHT') {
          product.totalHT = product.priceHT * product.quantity
        }
      }
      
      newProducts[index] = product
      return { ...prev, products: newProducts }
    })
  }

  const calculateTotals = () => {
    const totalHT = formData.products.reduce((sum, item) => sum + item.totalHT, 0)
    const tva = totalHT * 0.20
    const totalTTC = totalHT + tva
    return { totalHT, tva, totalTTC }
  }

  const handlePreview = () => {
    if (!formData.clientName || !formData.clientEmail || formData.products.length === 0) {
      addToast(toast.warning(
        'Champs manquants',
        'Veuillez remplir tous les champs obligatoires et ajouter au moins un produit.'
      ))
      return
    }
    const invalidProducts = formData.products.filter(p => !p.productId || p.quantity <= 0)
    if (invalidProducts.length > 0) {
      addToast(toast.warning(
        'Produits invalides',
        'Veuillez sélectionner un produit et une quantité valide pour tous les articles.'
      ))
      return
    }
    setShowPreview(true)
  }

  const handleSaveQuote = async (generatePDF = false) => {
    // This function is now called from the preview modal or the simple save button
    if (!formData.clientName || !formData.clientEmail || formData.products.length === 0) {
      addToast(toast.warning(
        'Champs manquants',
        'Veuillez remplir tous les champs obligatoires et ajouter au moins un produit.'
      ))
      return
    }

    // Validate all products have required data
    const invalidProducts = formData.products.filter(p => !p.productId || p.quantity <= 0)
    if (invalidProducts.length > 0) {
      addToast(toast.warning(
        'Produits invalides',
        'Veuillez sélectionner un produit et une quantité valide pour tous les articles.'
      ))
      return
    }

    setIsLoading(true)
    try {
      const { totalHT, totalTTC } = calculateTotals()
      
      const quoteData = {
        ...formData,
        totalHT,
        totalTTC,
        tva: 20,
        generatePDF: false // PDF is now client-side, this can be removed or repurposed
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      })

      if (response.ok) {
        addToast(toast.success(
          'Devis créé',
          'Le nouveau devis a été créé avec succès'
        ))
        router.push('/admin/devis')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        addToast(toast.error(
          'Erreur de création',
          errorData.error || 'Une erreur est survenue lors de la création du devis'
        ))
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      addToast(toast.error(
        'Erreur de connexion',
        'Impossible de communiquer avec le serveur'
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (generatePDF = false) => {
    if (!formData.clientName || !formData.clientEmail || formData.products.length === 0) {
      addToast(toast.warning(
        'Champs manquants',
        'Veuillez remplir tous les champs obligatoires et ajouter au moins un produit.'
      ))
      return
    }

    // Validate all products have required data
    const invalidProducts = formData.products.filter(p => !p.productId || p.quantity <= 0)
    if (invalidProducts.length > 0) {
      addToast(toast.warning(
        'Produits invalides',
        'Veuillez sélectionner un produit et une quantité valide pour tous les articles.'
      ))
      return
    }

    setIsLoading(true)
    try {
      const { totalHT, totalTTC } = calculateTotals()
      
      const quoteData = {
        ...formData,
        totalHT,
        totalTTC,
        tva: 20,
        generatePDF
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      })

      if (response.ok) {
        const result = await response.json()
        if (generatePDF && result.pdfPath) {
          window.open(result.pdfPath, '_blank')
          addToast(toast.success(
            'Devis créé avec PDF',
            'Le devis a été créé et le PDF généré avec succès'
          ))
        } else {
          addToast(toast.success(
            'Devis créé',
            'Le nouveau devis a été créé avec succès'
          ))
        }
        router.push('/admin/devis')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        addToast(toast.error(
          'Erreur de création',
          errorData.error || 'Une erreur est survenue lors de la création du devis'
        ))
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      addToast(toast.error(
        'Erreur de connexion',
        'Impossible de communiquer avec le serveur'
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const { totalHT, tva, totalTTC } = calculateTotals()

  return (
    <>
      {showPreview && (
        <QuotePreview 
          quoteData={formData}
          totals={calculateTotals()}
          onClose={() => setShowPreview(false)}
          onSave={() => handleSaveQuote(false)}
        />
      )}
      <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/admin/devis">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2" size={16} />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Nouveau Devis</h1>
                <p className="text-gray-600">Créer un nouveau devis client</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleSaveQuote(false)}
                disabled={isLoading}
              >
                <Save className="mr-2" size={16} />
                Enregistrer
              </Button>
              <Button 
                onClick={handlePreview}
                disabled={isLoading}
              >
                <FileText className="mr-2" size={16} />
                Preview PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Client Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom du client *</label>
                      <Input
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Nom complet du client"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <Input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Téléphone</label>
                      <Input
                        value={formData.clientPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        placeholder="+212 6 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Référence projet</label>
                      <Input
                        value={formData.projectRef}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectRef: e.target.value }))}
                        placeholder="REF-2024-001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Notes additionnelles..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Produits</CardTitle>
                    <Button onClick={addProduct} size="sm">
                      <Plus className="mr-2" size={16} />
                      Ajouter Produit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Aucun produit ajouté. Cliquez sur "Ajouter Produit" pour commencer.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.products.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Produit {index + 1}</h4>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeProduct(index)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2 lg:col-span-1">
                              <label className="block text-sm font-medium mb-1">Produit *</label>
                              <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={item.productId}
                                onChange={(e) => updateProduct(index, 'productId', e.target.value)}
                                required
                              >
                                <option value="">Sélectionner un produit</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.reference} - {product.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Quantité</label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Largeur (cm)</label>
                              <Input
                                type="number"
                                step="0.1"
                                value={item.width || ''}
                                onChange={(e) => updateProduct(index, 'width', parseFloat(e.target.value) || 0)}
                                placeholder="100"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Longueur (cm)</label>
                              <Input
                                type="number"
                                step="0.1"
                                value={item.length || ''}
                                onChange={(e) => updateProduct(index, 'length', parseFloat(e.target.value) || 0)}
                                placeholder="200"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Épaisseur (mm)</label>
                              <Input
                                type="number"
                                step="0.1"
                                value={item.thickness || ''}
                                onChange={(e) => updateProduct(index, 'thickness', parseFloat(e.target.value) || 6)}
                                placeholder="6"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Prix HT (DH)</label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.priceHT}
                                onChange={(e) => updateProduct(index, 'priceHT', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                Surface: {item.width && item.length ? ((item.width * item.length) / 10000).toFixed(2) : '0'} m²
                              </span>
                              <span className="font-medium">
                                Total HT: {item.totalHT.toFixed(2)} DH
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total HT:</span>
                      <span className="font-medium">{totalHT.toFixed(2)} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (20%):</span>
                      <span className="font-medium">{tva.toFixed(2)} DH</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total TTC:</span>
                        <span>{totalTTC.toFixed(2)} DH</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Les prix sont calculés automatiquement selon les dimensions</p>
                  <p>• Le prix minimum par produit est respecté</p>
                  <p>• TVA de 20% appliquée</p>
                  <p>• Le préview PDF permet de visualiser avant finalisation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  )
}
