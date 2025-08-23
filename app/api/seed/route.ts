import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST() {
  try {
    console.log('🌱 Starting database seed...')

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
    console.log('✅ Admin user created')

    // Create company settings using raw SQL to avoid TypeScript issues
    await prisma.$executeRaw`
      INSERT OR REPLACE INTO company_settings (
        id, name, address, phone, email, website, description, workingHours,
        tvaRate, paymentTerms, deliveryTerms, legalNotice, createdAt, updatedAt
      ) VALUES (
        'default', 'JetGlass', 
        '123 Rue de la Verrerie, 69000 Lyon, France',
        '+33 4 78 12 34 56',
        'contact@jetglass.fr',
        'www.jetglass.fr',
        'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans',
        'Lundi - Vendredi: 8h00 - 18h00, Samedi: 9h00 - 12h00',
        20.0,
        '50% à la commande, 50% à l''enlèvement',
        '1 semaine pour les produits standards, 4 semaines pour les produits spéciaux',
        'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication',
        datetime('now'), datetime('now')
      )
    `
    console.log('✅ Company settings created')

    // Create categories
    const categories = [
      {
        name: 'Verres de sécurité',
        description: 'Verres trempés et feuilletés pour applications sécurisées'
      },
      {
        name: 'Double vitrage',
        description: 'Solutions d\'isolation thermique et acoustique'
      },
      {
        name: 'Verres décoratifs',
        description: 'Verres colorés, sablés et texturés pour décoration'
      },
      {
        name: 'Miroirs',
        description: 'Miroirs sur mesure pour tous usages'
      },
      {
        name: 'Verres techniques',
        description: 'Verres spéciaux pour applications industrielles'
      }
    ]

    const createdCategories = []
    for (const category of categories) {
      const created = await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category
      })
      createdCategories.push(created)
    }
    console.log('✅ Categories created:', createdCategories.length)

    // Create products
    const products = [
      {
        reference: 'VER-001',
        name: 'Verre trempé 6mm',
        description: 'Verre de sécurité trempé épaisseur 6mm, résistant aux chocs',
        categoryId: createdCategories[0].id,
        basePricePerM2: 45.0,
        complexityFactor: 1.0,
        thicknessFactor: 1.0,
        minPrice: 50.0,
        dimensions: 'Sur mesure'
      },
      {
        reference: 'VER-002',
        name: 'Verre trempé 8mm',
        description: 'Verre de sécurité trempé épaisseur 8mm, extra résistant',
        categoryId: createdCategories[0].id,
        basePricePerM2: 55.0,
        complexityFactor: 1.1,
        thicknessFactor: 1.2,
        minPrice: 65.0,
        dimensions: 'Sur mesure'
      },
      {
        reference: 'DV-001',
        name: 'Double vitrage 4/16/4',
        description: 'Double vitrage isolant avec lame d\'air 16mm',
        categoryId: createdCategories[1].id,
        basePricePerM2: 85.0,
        complexityFactor: 1.2,
        thicknessFactor: 1.5,
        minPrice: 120.0,
        dimensions: 'Sur mesure'
      },
      {
        reference: 'DV-002',
        name: 'Double vitrage 6/20/6',
        description: 'Double vitrage haute performance avec lame d\'air 20mm',
        categoryId: createdCategories[1].id,
        basePricePerM2: 105.0,
        complexityFactor: 1.3,
        thicknessFactor: 1.8,
        minPrice: 150.0,
        dimensions: 'Sur mesure'
      },
      {
        reference: 'DEC-001',
        name: 'Verre sablé',
        description: 'Verre dépoli par sablage pour intimité',
        categoryId: createdCategories[2].id,
        basePricePerM2: 65.0,
        complexityFactor: 1.4,
        thicknessFactor: 1.1,
        minPrice: 80.0,
        dimensions: 'Sur mesure'
      },
      {
        reference: 'MIR-001',
        name: 'Miroir 4mm',
        description: 'Miroir argenté épaisseur 4mm',
        categoryId: createdCategories[3].id,
        basePricePerM2: 35.0,
        complexityFactor: 1.0,
        thicknessFactor: 0.9,
        minPrice: 40.0,
        dimensions: 'Sur mesure'
      },
      {
        reference: 'TECH-001',
        name: 'Verre anti-reflet',
        description: 'Verre traité anti-reflet pour vitrines',
        categoryId: createdCategories[4].id,
        basePricePerM2: 95.0,
        complexityFactor: 1.6,
        thicknessFactor: 1.2,
        minPrice: 130.0,
        dimensions: 'Sur mesure'
      }
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { reference: product.reference },
        update: {},
        create: product
      })
    }
    console.log('✅ Products created:', products.length)

    return NextResponse.json({ 
      success: true, 
      message: 'Base de données peuplée avec succès!',
      data: {
        categories: createdCategories.length,
        products: products.length
      }
    })

  } catch (error) {
    console.error('❌ Seed failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du peuplement de la base de données',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
