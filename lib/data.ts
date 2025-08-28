import { prisma } from './prisma';

export async function getDashboardStats() {
  try {
    const products = await prisma.product.findMany({ where: { active: true } });
    const quotes = await prisma.quote.findMany();

    const totalProducts = products.length;
    const totalQuotes = quotes.length;
    const pendingQuotes = quotes.filter(q => q.status === 'PENDING').length;

    return {
      totalProducts,
      totalQuotes,
      pendingQuotes,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dashboard stats.');
  }
}

export async function getRecentQuotes() {
  try {
    const recentQuotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return recentQuotes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch recent quotes.');
  }
}

export async function getAllQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    return quotes;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quotes.');
  }
}

export async function getCompanySettings() {
  try {
    const settings = await prisma.companySettings.findFirst();
    // If no settings, return default values
    if (!settings) {
      return {
        id: '',
        name: 'JetGlass',
        currency: 'DH',
        tvaRate: 20,
        address: '123 Rue de la Verrerie, 75001 Paris',
        phone: '01 23 45 67 89',
        email: 'contact@jetglass.fr',
        website: 'www.jetglass.fr',
        paymentTerms: '50% à la commande, 50% à la livraison',
        deliveryTerms: 'Livraison sous 2-3 semaines',
        legalNotice: 'Prière de vérifier les dimensions chiffrées sur ce devis avant fabrication'
      };
    }
    return settings;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch company settings.');
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}
