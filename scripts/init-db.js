const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if settings already exist
    const existingSettings = await prisma.companySettings.findFirst()
    
    if (!existingSettings) {
      // Create default company settings
      await prisma.companySettings.create({
        data: {
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
      console.log('✅ Default company settings created')
    } else {
      console.log('✅ Company settings already exist')
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
