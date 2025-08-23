// Système de calcul de prix dynamique pour JetGlass

interface Product {
  basePricePerM2: number
  complexityFactor: number
  thicknessFactor: number
  minPrice: number
}

interface Dimensions {
  width: number  // cm
  length: number // cm
  thickness: number // mm
}

/**
 * Calcule le prix d'un produit selon ses dimensions et caractéristiques
 * 
 * Équation de test :
 * Prix = (Surface_m² × Prix_base_m² × Facteur_complexité × Facteur_épaisseur) + Prix_minimum
 * 
 * Facteurs d'ajustement :
 * - Épaisseur > 10mm : +20%
 * - Épaisseur > 20mm : +50%
 * - Surface < 0.5m² : +30% (petites pièces plus coûteuses à produire)
 * - Surface > 5m² : -10% (économies d'échelle)
 */
export function calculatePrice(product: Product, dimensions: Dimensions, quantity: number = 1): number {
  const { width, length, thickness } = dimensions
  const { basePricePerM2, complexityFactor, thicknessFactor, minPrice } = product

  // Conversion en mètres pour le calcul de surface
  const surfaceM2 = (width / 100) * (length / 100)
  
  // Prix de base selon la surface
  let basePrice = surfaceM2 * basePricePerM2

  // Application du facteur de complexité du produit
  basePrice *= complexityFactor

  // Facteur d'épaisseur dynamique
  let thicknessMultiplier = thicknessFactor
  if (thickness > 20) {
    thicknessMultiplier *= 1.5 // +50% pour épaisseur > 20mm
  } else if (thickness > 10) {
    thicknessMultiplier *= 1.2 // +20% pour épaisseur > 10mm
  }
  
  basePrice *= thicknessMultiplier

  // Ajustements selon la taille
  if (surfaceM2 < 0.5) {
    basePrice *= 1.3 // +30% pour petites pièces
  } else if (surfaceM2 > 5) {
    basePrice *= 0.9 // -10% pour grandes pièces
  }

  // Prix unitaire minimum
  const unitPrice = Math.max(basePrice, minPrice)

  // Prix total avec quantité
  return Math.round(unitPrice * quantity * 100) / 100 // Arrondi à 2 décimales
}

/**
 * Calcule le prix total d'un devis
 */
export function calculateQuoteTotal(items: Array<{
  product: Product
  dimensions: Dimensions
  quantity: number
}>): { totalHT: number, tva: number, totalTTC: number } {
  const totalHT = items.reduce((sum, item) => {
    return sum + calculatePrice(item.product, item.dimensions, item.quantity)
  }, 0)

  const tva = totalHT * 0.2 // 20% TVA
  const totalTTC = totalHT + tva

  return {
    totalHT: Math.round(totalHT * 100) / 100,
    tva: Math.round(tva * 100) / 100,
    totalTTC: Math.round(totalTTC * 100) / 100
  }
}

/**
 * Exemples de configuration produits :
 * 
 * Verre simple :
 * - basePricePerM2: 80€
 * - complexityFactor: 1
 * - thicknessFactor: 1
 * - minPrice: 50€
 * 
 * Verre sécurisé :
 * - basePricePerM2: 120€
 * - complexityFactor: 1.3
 * - thicknessFactor: 1.2
 * - minPrice: 80€
 * 
 * Double vitrage :
 * - basePricePerM2: 150€
 * - complexityFactor: 1.5
 * - thicknessFactor: 1.4
 * - minPrice: 120€
 */
