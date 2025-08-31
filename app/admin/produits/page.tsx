'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminSidebar from '@/components/admin/sidebar'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useToast, toast } from '@/components/ui/toast'

interface Category {
  id: string
  name: string
  description?: string
  active: boolean
}

interface Product {
  id: string
  reference: string
  name: string
  basePricePerM2: number
  complexityFactor: number
  thicknessFactor: number
  minPrice: number
  description?: string
  categoryId: string
  category?: Category
  dimensions?: string
  image?: string
  active: boolean
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 10
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    reference: '',
    name: '',
    description: '',
    categoryId: '',
    basePricePerM2: 0,
    complexityFactor: 1,
    thicknessFactor: 1,
    minPrice: 50,
    dimensions: '',
    image: '',
    active: true
  })

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/products?includeInactive=true')
      if (response.ok) {
        const data = await response.json()
        console.log("Produits reçus de l'API:", data) // Ajout du log pour le débogage
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchProducts()
    fetchCategories()
  }, [session, status, router, fetchProducts, fetchCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchProducts()
        resetForm()
        addToast(toast.success(
          editingProduct ? 'Produit modifié' : 'Produit créé',
          editingProduct ? 'Le produit a été modifié avec succès' : 'Le nouveau produit a été créé avec succès'
        ))
      } else {
        const errorData = await response.json().catch(() => ({}))
        addToast(toast.error(
          'Erreur',
          errorData.error || 'Une erreur est survenue lors de la sauvegarde'
        ))
      }
    } catch (error) {
      console.error('Error saving product:', error)
      addToast(toast.error(
        'Erreur de connexion',
        'Impossible de communiquer avec le serveur'
      ))
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      reference: product.reference,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      basePricePerM2: product.basePricePerM2,
      complexityFactor: product.complexityFactor,
      thicknessFactor: product.thicknessFactor,
      minPrice: product.minPrice,
      dimensions: product.dimensions || '',
      image: product.image || '',
      active: product.active
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          await fetchProducts()
          addToast(toast.success(
            'Produit supprimé',
            'Le produit a été supprimé avec succès'
          ))
        } else {
          const errorData = await response.json().catch(() => ({}))
          addToast(toast.error(
            'Erreur de suppression',
            errorData.error || 'Impossible de supprimer ce produit'
          ))
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        addToast(toast.error(
          'Erreur de connexion',
          'Impossible de communiquer avec le serveur'
        ))
      }
    }
  }

  const resetForm = () => {
    setFormData({
      reference: '',
      name: '',
      description: '',
      categoryId: '',
      basePricePerM2: 0,
      complexityFactor: 1,
      thicknessFactor: 1,
      minPrice: 50,
      dimensions: '',
      image: '',
      active: true
    })
    setEditingProduct(null)
    setShowForm(false)
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
              <p className="text-gray-600">Gérez votre catalogue de produits</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2" size={16} />
              Nouveau produit
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Product Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>
                    {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Référence *</label>
                        <Input
                          value={formData.reference}
                          onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nom *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Catégorie *</label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={formData.categoryId}
                          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                          required
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Prix de base par m² (€) *</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.basePricePerM2}
                          onChange={(e) => setFormData(prev => ({ ...prev, basePricePerM2: parseFloat(e.target.value) || 0 }))}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Prix de base utilisé dans le calcul dynamique</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Facteur de complexité *</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.complexityFactor}
                          onChange={(e) => setFormData(prev => ({ ...prev, complexityFactor: parseFloat(e.target.value) || 1 }))}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">1 = simple, 1.5 = complexe</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Facteur d'épaisseur *</label>
                        <Input
                          type="number"
                          step="0.1"
                          min="1"
                          value={formData.thicknessFactor}
                          onChange={(e) => setFormData(prev => ({ ...prev, thicknessFactor: parseFloat(e.target.value) || 1 }))}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Facteur de base pour l'épaisseur (ajustements automatiques)</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Prix minimum (€) *</label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.minPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, minPrice: parseFloat(e.target.value) || 0 }))}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Prix minimum garanti pour ce produit</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Dimensions</label>
                        <Input
                          value={formData.dimensions}
                          onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                          placeholder="ex: 100x50cm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">URL Image</label>
                        <Input
                          value={formData.image}
                          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      />
                      <label htmlFor="active" className="text-sm font-medium">Produit actif</label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Annuler
                      </Button>
                      <Button type="submit">
                        {editingProduct ? 'Modifier' : 'Créer'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix base/m²
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix min
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
                  {isLoading ? (
                    // Loading skeleton rows
                    Array.from({ length: itemsPerPage }, (_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg"></div>
                            <div className="ml-4">
                              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    currentProducts.map((product) => (
                    <tr key={product.id} className={`hover:bg-gray-50 ${!product.active ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.image ? (
                              <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">IMG</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">Réf: {product.reference}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category?.name || 'Sans catégorie'}</div>
                        {product.dimensions && (
                          <div className="text-sm text-gray-500">{product.dimensions}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.basePricePerM2} DH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.minPrice} DH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm ? 'Aucun produit trouvé pour cette recherche' : 'Aucun produit créé'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredProducts.length)} sur {filteredProducts.length} produits
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-10 h-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
