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
    throw new Error('Failed to fetch all quotes.');
  }
}
