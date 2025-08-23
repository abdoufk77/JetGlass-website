'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { Plus, Minus, Trash2, Send } from 'lucide-react'

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
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
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
          {/* Products Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sélectionner vos produits</h2>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>
                        Réf: {product.reference} | {product.category?.name || 'Sans catégorie'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end">
                        <Button onClick={() => addToQuote(product)} size="sm">
                          <Plus size={16} className="mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun produit disponible pour le moment</p>
              </div>
            )}
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
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
                  <div className="space-y-4 mb-6">
                    {quoteItems.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product.name}</h4>
                          <div className="grid grid-cols-3 gap-1 mt-2">
                            <Input
                              type="number"
                              placeholder="L (cm)"
                              value={item.width || ''}
                              onChange={(e) => updateDimensions(item.productId, 'width', parseFloat(e.target.value) || 0)}
                              className="text-xs h-6"
                            />
                            <Input
                              type="number"
                              placeholder="l (cm)"
                              value={item.length || ''}
                              onChange={(e) => updateDimensions(item.productId, 'length', parseFloat(e.target.value) || 0)}
                              className="text-xs h-6"
                            />
                            <Input
                              type="number"
                              placeholder="É (mm)"
                              value={item.thickness || ''}
                              onChange={(e) => updateDimensions(item.productId, 'thickness', parseFloat(e.target.value) || 0)}
                              className="text-xs h-6"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromQuote(item.productId)}
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucun produit sélectionné</p>
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
                      'Génération en cours...'
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
        </div>
      </div>
    </div>
  )
}
