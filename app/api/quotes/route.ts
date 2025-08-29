export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQuotePDF } from '@/lib/pdf'
import { sendQuoteEmail } from '@/lib/email'
import { generateQuoteNumber } from '@/lib/utils'

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        products: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    // Delete the quote and its related products
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

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      projectRef,
      notes,
      products, 
      totalHT, 
      totalTTC, 
      tva = 20.0,
      generatePDF = false 
    } = data

    // Generate quote number
    const quoteNumber = generateQuoteNumber()

    // Create quote in database
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        projectRef: projectRef || null,
        notes: notes || null,
        totalHT: totalHT || 0,
        totalTTC: totalTTC || 0,
        tva: tva,
        status: 'PENDING',
        products: {
          create: products.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceHT: item.priceHT || 0,
            totalHT: item.totalHT || 0,
            width: item.width || null,
            length: item.length || null,
            thickness: item.thickness || null
          }))
        }
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })

    let pdfPath = null

    // Generate PDF if requested
    if (generatePDF) {
      // Get company settings
      let companySettings = await prisma.companySettings.findFirst()
      if (!companySettings) {
        companySettings = await prisma.companySettings.create({
          data: {
            name: 'JetGlass',
            address: '123 Rue de la Verrerie, 75001 Paris',
            phone: '01 23 45 67 89',
            email: 'contact@jetglass.fr',
            website: 'www.jetglass.fr'
          }
        })
      }

      // Generate PDF
      pdfPath = await generateQuotePDF(quote, companySettings)

      // Update quote with PDF path
      await prisma.quote.update({
        where: { id: quote.id },
        data: { pdfPath }
      })

      // Optionally send email (commented out for admin creation)
      // await sendQuoteEmail(clientEmail, clientName, quoteNumber, pdfPath)
    }

    return NextResponse.json({
      message: 'Quote created successfully',
      quoteNumber,
      pdfPath,
      quote: { ...quote, pdfPath }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}
