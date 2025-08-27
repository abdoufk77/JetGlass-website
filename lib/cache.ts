// Cache utility for better performance
class PageCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttlMinutes = 5) {
    const ttl = ttlMinutes * 60 * 1000 // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  clear() {
    this.cache.clear()
  }
  
  delete(key: string) {
    this.cache.delete(key)
  }
}

export const pageCache = new PageCache()

// Route prefetching utility
export const prefetchRoute = (path: string) => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = path
    document.head.appendChild(link)
  }
}

// Cache keys
export const CACHE_KEYS = {
  DEVIS_FORM: 'devis-form-data',
  PRODUCTS: 'products-list',
  CATEGORIES: 'categories-list',
  COMPANY_INFO: 'company-info'
}
