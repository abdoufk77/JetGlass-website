import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendQuoteNotification } from '@/lib/email';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['VALIDATED', 'PENDING', 'REJECTED', 'ACCEPTED']),
});

type StatusUpdateBody = z.infer<typeof statusSchema>;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: StatusUpdateBody = await request.json();

    const validation = statusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid status provided. Must be VALIDATED, PENDING, REJECTED, or ACCEPTED.' },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    // Récupérer le devis pour obtenir les informations client
    const quote = await prisma.quote.findUnique({
      where: { id },
      select: {
        clientEmail: true,
        clientName: true,
        quoteNumber: true,
        totalTTC: true
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status },
    });

    // Envoyer notification email si le client accepte ou demande négociation
    if (status === 'ACCEPTED' || status === 'PENDING') {
      try {
        const action = status === 'ACCEPTED' ? 'accepted' : 'negotiated';
        await sendQuoteNotification({
          quoteId: id,
          clientEmail: quote.clientEmail,
          clientAction: action,
          quoteDetails: {
            reference: quote.quoteNumber,
            totalAmount: quote.totalTTC,
            clientName: quote.clientName
          }
        });
        console.log(`📧 Email de notification envoyé pour le devis ${quote.quoteNumber} - Action: ${action}`);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // Continue même si l'email échoue
      }
    }

    return NextResponse.json(updatedQuote, { status: 200 });
  } catch (error) {
    console.error('Error updating quote status:', error);
    return NextResponse.json(
      { error: 'Failed to update quote status' },
      { status: 500 }
    );
  }
}
