import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jetglass.com' },
    update: {},
    create: {
      email: 'admin@jetglass.com',
      password: hashedPassword,
      name: 'Admin JetGlass',
      role: 'ADMIN'
    }
  })

  console.log('Admin user created:', admin)

  // Create company settings
  // Create default company settings
  const companySettings = await prisma.companySettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'JetGlass',
      address: '123 Rue de la Verrerie, 69000 Lyon, France',
      phone: '+33 4 78 12 34 56',
      email: 'contact@jetglass.fr',
      website: 'www.jetglass.fr',
      description: 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans',
      workingHours: 'Lundi - Vendredi: 8h00 - 18h00, Samedi: 9h00 - 12h00',
      tvaRate: 20.0,
      paymentTerms: '50% à la commande, 50% à l\'enlèvement',
      deliveryTerms: '1 semaine pour les produits standards, 4 semaines pour les produits spéciaux',
      legalNotice: 'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication'
    }
  })

  console.log('Company settings created:', companySettings)

  // Create categories
  const categories = [
    {
      name: 'Verres de Sécurité',
      description: 'Verres trempés et feuilletés pour la sécurité',
      active: true
    },
    {
      name: 'Double Vitrage',
      description: 'Solutions d\'isolation thermique et acoustique',
      active: true
    },
    {
      name: 'Verres Décoratifs',
      description: 'Verres esthétiques pour vos projets décoratifs',
      active: true
    },
    {
      name: 'Verres Standards',
      description: 'Verres classiques pour applications courantes',
      active: true
    },
    {
      name: 'Sur Mesure',
      description: 'Solutions personnalisées selon vos besoins',
      active: true
    }
  ]

  const createdCategories: Record<string, any> = {}
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData
    })
    createdCategories[categoryData.name] = category
    console.log('Category created:', category.name)
  }

  // Create sample products with new pricing model
  const products = [
    {
      reference: 'VT-001',
      name: 'Verre Trempé Standard',
      description: 'Verre trempé de sécurité pour applications standard',
      categoryId: createdCategories['Verres de Sécurité'].id,
      basePricePerM2: 120.00,
      complexityFactor: 1.3,
      thicknessFactor: 1.2,
      minPrice: 80.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'VF-002',
      name: 'Verre Feuilleté',
      description: 'Verre feuilleté sécurisé pour façades',
      categoryId: createdCategories['Verres de Sécurité'].id,
      basePricePerM2: 150.00,
      complexityFactor: 1.5,
      thicknessFactor: 1.3,
      minPrice: 100.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'DV-003',
      name: 'Double Vitrage Classique',
      description: 'Double vitrage isolant thermique et acoustique',
      categoryId: createdCategories['Double Vitrage'].id,
      basePricePerM2: 180.00,
      complexityFactor: 1.4,
      thicknessFactor: 1.4,
      minPrice: 120.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'DV-004',
      name: 'Double Vitrage Renforcé',
      description: 'Double vitrage avec gaz argon pour isolation renforcée',
      categoryId: createdCategories['Double Vitrage'].id,
      basePricePerM2: 220.00,
      complexityFactor: 1.6,
      thicknessFactor: 1.5,
      minPrice: 150.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'VD-005',
      name: 'Verre Décoratif Sablé',
      description: 'Verre sablé pour cloisons décoratives',
      categoryId: createdCategories['Verres Décoratifs'].id,
      basePricePerM2: 95.00,
      complexityFactor: 1.2,
      thicknessFactor: 1.1,
      minPrice: 70.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'VD-006',
      name: 'Verre Coloré',
      description: 'Verre teinté dans la masse, plusieurs coloris disponibles',
      categoryId: createdCategories['Verres Décoratifs'].id,
      basePricePerM2: 110.00,
      complexityFactor: 1.3,
      thicknessFactor: 1.1,
      minPrice: 80.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'SM-007',
      name: 'Vitrage Sur Mesure',
      description: 'Solution personnalisée selon vos spécifications',
      categoryId: createdCategories['Sur Mesure'].id,
      basePricePerM2: 250.00,
      complexityFactor: 2.0,
      thicknessFactor: 1.8,
      minPrice: 200.00,
      dimensions: 'Selon projet',
      active: true
    },
    {
      reference: 'VS-008',
      name: 'Verre Simple',
      description: 'Verre float standard pour applications courantes',
      categoryId: createdCategories['Verres Standards'].id,
      basePricePerM2: 60.00,
      complexityFactor: 1.0,
      thicknessFactor: 1.0,
      minPrice: 40.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'VT-009',
      name: 'Verre Trempé Extra-Fort',
      description: 'Verre trempé haute résistance pour applications exigeantes',
      categoryId: createdCategories['Verres de Sécurité'].id,
      basePricePerM2: 160.00,
      complexityFactor: 1.7,
      thicknessFactor: 1.6,
      minPrice: 120.00,
      dimensions: 'Sur mesure',
      active: true
    },
    {
      reference: 'VD-010',
      name: 'Verre Imprimé',
      description: 'Verre avec motifs imprimés pour décoration',
      categoryId: createdCategories['Verres Décoratifs'].id,
      basePricePerM2: 85.00,
      complexityFactor: 1.4,
      thicknessFactor: 1.0,
      minPrice: 65.00,
      dimensions: 'Sur mesure',
      active: true
    }
  ]

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { reference: productData.reference },
      update: {},
      create: productData
    })
    console.log('Product created:', product.name)
  }

  // Create sample quotes with fake data
  const sampleQuotes = [
    {
      quoteNumber: 'DEV-2024-001',
      clientName: 'Jean Dupont',
      clientEmail: 'jean.dupont@email.com',
      clientPhone: '01 23 45 67 89',
      status: 'PENDING',
      totalHT: 450.00,
      totalTTC: 540.00,
      tva: 20.0
    },
    {
      quoteNumber: 'DEV-2024-002',
      clientName: 'Marie Martin',
      clientEmail: 'marie.martin@email.com',
      clientPhone: '01 98 76 54 32',
      status: 'VALIDATED',
      totalHT: 780.00,
      totalTTC: 936.00,
      tva: 20.0
    },
    {
      quoteNumber: 'DEV-2024-003',
      clientName: 'Pierre Durand',
      clientEmail: 'pierre.durand@email.com',
      clientPhone: '01 11 22 33 44',
      status: 'PENDING',
      totalHT: 320.00,
      totalTTC: 384.00,
      tva: 20.0
    }
  ]

  for (const quoteData of sampleQuotes) {
    const quote = await prisma.quote.upsert({
      where: { quoteNumber: quoteData.quoteNumber },
      update: {},
      create: quoteData
    })
    console.log('Quote created:', quote.quoteNumber)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
