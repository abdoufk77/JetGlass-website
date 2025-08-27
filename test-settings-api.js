const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testSettings() {
  try {
    console.log('Testing database connection...')
    
    // Check if settings exist
    const settings = await prisma.companySettings.findFirst()
    console.log('Current settings in database:', settings)
    
    if (!settings) {
      console.log('No settings found, creating default ones...')
      const newSettings = await prisma.companySettings.create({
        data: {
          name: 'JetGlass DB Test',
          address: '123 Rue de la Verrerie, 69000 Lyon, France',
          phone: '+33 4 78 12 34 56',
          email: 'contact@jetglass.fr',
          website: 'www.jetglass.fr',
          description: 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans',
          workingHours: 'Lundi - Vendredi: 8h00 - 18h00, Samedi: 9h00 - 12h00',
          facebookUrl: 'https://facebook.com/jetglass',
          twitterUrl: 'https://twitter.com/jetglass',
          linkedinUrl: 'https://linkedin.com/company/jetglass',
          instagramUrl: 'https://instagram.com/jetglass',
          tvaRate: 20.0,
          paymentTerms: '50% à la commande, 50% à l\'enlèvement',
          deliveryTerms: '1 semaine pour les produits standards, 4 semaines pour les produits spéciaux',
          legalNotice: 'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication'
        }
      })
      console.log('Created new settings:', newSettings)
    } else {
      console.log('Updating existing settings with social media...')
      const updatedSettings = await prisma.companySettings.update({
        where: { id: settings.id },
        data: {
          name: 'JetGlass - Données DB',
          address: '456 Avenue de la Verrerie, 69000 Lyon, France',
          phone: '+33 4 78 99 88 77',
          email: 'info@jetglass-db.fr',
          description: 'Données mises à jour depuis la base de données - Test réussi!',
          workingHours: 'Lundi - Vendredi: 9h00 - 17h00, Samedi: 10h00 - 14h00',
          facebookUrl: 'https://facebook.com/jetglass-test',
          twitterUrl: 'https://twitter.com/jetglass-test',
          linkedinUrl: 'https://linkedin.com/company/jetglass-test',
          instagramUrl: 'https://instagram.com/jetglass-test'
        }
      })
      console.log('Updated settings:', updatedSettings)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSettings()
