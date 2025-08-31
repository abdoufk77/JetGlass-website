import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['ACCEPTED', 'PENDING']),
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
        { error: 'Invalid status provided. Must be ACCEPTED or PENDING.' },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedQuote, { status: 200 });
  } catch (error) {
    console.error('Error updating quote status:', error);
    return NextResponse.json(
      { error: 'Failed to update quote status' },
      { status: 500 }
    );
  }
}
