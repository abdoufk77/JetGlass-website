import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteToClient } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId } = body;

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // Récupérer le devis avec ses détails
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: {
        id: true,
        clientEmail: true,
        clientName: true,
        quoteNumber: true,
        totalTTC: true,
        status: true
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Envoyer l'email au client
    const emailResult = await sendQuoteToClient({
      clientEmail: quote.clientEmail,
      clientName: quote.clientName,
      quoteNumber: quote.quoteNumber,
      totalAmount: quote.totalTTC,
      quoteId: quote.id
    });

    return NextResponse.json({
      success: true,
      message: 'Devis envoyé au client avec succès',
      emailResult
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du devis:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
