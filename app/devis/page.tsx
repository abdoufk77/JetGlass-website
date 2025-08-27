'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { pageCache, CACHE_KEYS } from '@/lib/cache'
import { Plus, Minus, Trash2, Send, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  reference: string
  categoryId: string
  category?: Category
  basePricePerM2: number
  complexityFactor: number
  thicknessFactor: number
  minPrice: number
  dimensions?: string
}

interface QuoteItem {
  productId: string
  product: Product
  quantity: number
  width?: number
  length?: number
  thickness?: number
}

export default function DevisPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  useEffect(() => {
    loadProducts()
    // Load cached client info
    const cachedClientInfo = pageCache.get(CACHE_KEYS.DEVIS_FORM)
    if (cachedClientInfo) {
      setClientInfo(cachedClientInfo)
    }
  }, [])

  // Cache client info when it changes
  useEffect(() => {
    if (clientInfo.name || clientInfo.email || clientInfo.phone) {
      pageCache.set(CACHE_KEYS.DEVIS_FORM, clientInfo, 30) // Cache for 30 minutes
    }
  }, [clientInfo])

  const loadProducts = async () => {
    setIsLoading(true)
    
    // Try to get from cache first
    const cachedProducts = pageCache.get(CACHE_KEYS.PRODUCTS)
    if (cachedProducts) {
      setProducts(cachedProducts)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        // Cache products for 10 minutes
        pageCache.set(CACHE_KEYS.PRODUCTS, data, 10)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToQuote = (product: Product) => {
    const existingItem = quoteItems.find(item => item.productId === product.id)
    if (existingItem) {
      setQuoteItems(items =>
        items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setQuoteItems(items => [...items, { productId: product.id, product, quantity: 1, width: 0, length: 0, thickness: 0 }])
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(productId)
      return
    }
    setQuoteItems(items =>
      items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const updateDimensions = (productId: string, field: 'width' | 'length' | 'thickness', value: number) => {
    setQuoteItems(items =>
      items.map(item =>
        item.productId === productId ? { ...item, [field]: value } : item
      )
    )
  }

  const removeFromQuote = (productId: string) => {
    setQuoteItems(items => items.filter(item => item.productId !== productId))
  }

  const calculateTotal = () => {
    // Pour l'instant, on ne calcule pas les prix automatiquement
    // Le devis sera calculé manuellement par l'admin
    return { totalHT: 0, tva: 0, totalTTC: 0 }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quoteItems.length === 0) {
      setMessage('Veuillez ajouter au moins un produit à votre devis')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const { totalHT, totalTTC } = calculateTotal()
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          clientPhone: clientInfo.phone,
          products: quoteItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            width: item.width,
            length: item.length,
            thickness: item.thickness
          })),
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`Devis ${data.quoteNumber} créé avec succès ! Vous recevrez le PDF par email.`)
        setQuoteItems([])
        setClientInfo({ name: '', email: '', phone: '' })
      } else {
        const error = await response.json()
        setMessage(`Erreur: ${error.message}`)
      }
    } catch (error) {
      setMessage('Erreur lors de la création du devis')
    } finally {
      setIsSubmitting(false)
    }
  }

  const { totalHT, tva, totalTTC } = calculateTotal()

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demande de Devis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sélectionnez vos produits et obtenez un devis personnalisé en quelques clics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Summary - Mobile First */}
          <div className="lg:col-span-1 lg:order-2 order-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Votre Devis</CardTitle>
                <CardDescription>
                  {quoteItems.length} produit{quoteItems.length !== 1 ? 's' : ''} sélectionné{quoteItems.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Quote Items */}
                {quoteItems.length > 0 ? (
                  <div className="space-y-6 mb-6">
                    {quoteItems.map((item) => (
                      <div key={item.productId} className="border-b pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src="/images/produits/1.png" // Placeholder image
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-800 flex-1 pr-2">{item.product.name}</h4>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 flex-shrink-0"
                                onClick={() => removeFromQuote(item.productId)}
                              >
                                <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-x-3 mt-4">
                              <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-500 h-4 mb-1">Largeur (cm)</label>
                                <Input
                                  type="number"
                                  placeholder="120"
                                  value={item.width || ''}
                                  onChange={(e) => updateDimensions(item.productId, 'width', parseFloat(e.target.value) || 0)}
                                  className="h-9 w-full"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-500 h-4 mb-1">Longueur (cm)</label>
                                <Input
                                  type="number"
                                  placeholder="80"
                                  value={item.length || ''}
                                  onChange={(e) => updateDimensions(item.productId, 'length', parseFloat(e.target.value) || 0)}
                                  className="h-9 w-full"
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-xs font-medium text-gray-500 h-4 mb-1">Épais. (mm)</label>
                                <Input
                                  type="number"
                                  placeholder="4"
                                  value={item.thickness || ''}
                                  onChange={(e) => updateDimensions(item.productId, 'thickness', parseFloat(e.target.value) || 0)}
                                  className="h-9 w-full"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                              <label className="text-sm font-medium text-gray-700">Quantité:</label>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus size={14} />
                              </Button>
                              <span className="w-10 text-center font-semibold text-lg text-gray-800">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Votre devis est vide</p>
                    <p className="text-sm text-gray-400 mt-1">Ajoutez des produits pour commencer</p>
                  </div>
                )}

                {/* Note about pricing */}
                {quoteItems.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 text-center italic">
                      Le prix sera calculé selon vos dimensions et spécifications
                    </p>
                  </div>
                )}

                {/* Client Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <h3 className="font-semibold">Vos informations</h3>
                  
                  <Input
                    placeholder="Nom complet *"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  
                  <Input
                    placeholder="Téléphone"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || quoteItems.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Générer le devis
                      </>
                    )}
                  </Button>
                </form>

                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('succès') 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {message}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Selection */}
          <div className="lg:col-span-2 lg:order-1 order-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sélectionner vos produits</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end">
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <div className="flex items-start p-4">
                        <div className="flex-1">
                          <CardHeader className="p-0 pb-3">
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription>
                              Réf: {product.reference} | {product.category?.name || 'Sans catégorie'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="flex justify-start">
                              <Button onClick={() => addToQuote(product)} size="sm">
                                <Plus size={16} className="mr-1" />
                                Ajouter
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden ml-4 flex-shrink-0">
                          <img
                            src="/images/produits/1.png"
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun produit disponible pour le moment</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
