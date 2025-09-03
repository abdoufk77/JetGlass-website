import { NextRequest, NextResponse } from 'next/server';
import { sendQuoteNotification } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, clientEmail, action } = body;

    // Validation des données
    if (!quoteId || !clientEmail || !action) {
      return NextResponse.json(
        { error: 'Données manquantes: quoteId, clientEmail et action sont requis' },
        { status: 400 }
      );
    }

    if (!['accepted', 'negotiated'].includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide. Doit être "accepted" ou "negotiated"' },
        { status: 400 }
      );
    }

    // Récupérer les détails du devis depuis la base de données
    let quoteDetails = {};
    try {
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId }
      });

      if (quote) {
        quoteDetails = {
          reference: quote.quoteNumber || quoteId,
          totalAmount: quote.totalTTC,
          clientName: quote.clientName || 'Client'
        };
      }
    } catch (dbError) {
      console.warn('Impossible de récupérer les détails du devis:', dbError);
      // Continue sans les détails du devis
    }

    // Envoyer l'email de notification
    const emailResult = await sendQuoteNotification({
      quoteId,
      clientEmail,
      clientAction: action,
      quoteDetails
    });

    // Optionnel: Mettre à jour le statut du devis dans la base de données
    try {
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: action === 'accepted' ? 'ACCEPTED' : 'NEGOTIATION',
          updatedAt: new Date()
        }
      });
    } catch (dbError) {
      console.warn('Impossible de mettre à jour le statut du devis:', dbError);
      // L'email a été envoyé, donc on continue
    }

    return NextResponse.json({
      success: true,
      message: 'Notification envoyée avec succès',
      emailResult
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Endpoint pour tester la configuration email
export async function GET() {
  try {
    const { testEmailConfiguration } = await import('@/lib/email');
    const result = await testEmailConfiguration();
    
    return NextResponse.json({
      message: 'Test de configuration email',
      ...result
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    );
  }
}
