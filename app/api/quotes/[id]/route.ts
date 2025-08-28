import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQuotePDF } from '@/lib/pdf'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      projectRef,
      notes,
      status,
      products,
      totalHT,
      totalTTC,
      tva
    } = data

    // Start a transaction to update quote and products
    const result = await prisma.$transaction(async (tx) => {
      // Update the quote
      const updatedQuote = await tx.quote.update({
        where: { id: params.id },
        data: {
          clientName,
          clientEmail,
          clientPhone,
          projectRef,
          notes,
          status,
          totalHT,
          totalTTC,
          tva
        }
      })

      // Delete existing products
      await tx.quoteProduct.deleteMany({
        where: { quoteId: params.id }
      })

      // Create new products
      if (products && products.length > 0) {
        await tx.quoteProduct.createMany({
          data: products.map((product: any) => ({
            quoteId: params.id,
            productId: product.productId,
            quantity: product.quantity,
            width: product.width,
            length: product.length,
            thickness: product.thickness,
            priceHT: product.priceHT,
            totalHT: product.totalHT
          }))
        })
      }

      // Return the updated quote with products
      return await tx.quote.findUnique({
        where: { id: params.id },
        include: {
          products: {
            include: {
              product: true
            }
          }
        }
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    // Delete the quote and its related products (cascade delete should handle this)
    await prisma.quote.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Quote deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    )
  }
}
