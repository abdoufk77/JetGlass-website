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

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { clientName, clientEmail, clientPhone, products } = data

    // Generate quote number
    const quoteNumber = generateQuoteNumber()

    // Create quote in database
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        clientName,
        clientEmail,
        clientPhone,
        totalHT: 0, // Will be calculated manually by admin
        totalTTC: 0, // Will be calculated manually by admin
        tva: 20.0,
        status: 'PENDING',
        products: {
          create: products.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceHT: 0, // Will be set by admin
            totalHT: 0, // Will be calculated by admin
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
    const pdfPath = await generateQuotePDF(quote, companySettings)

    // Update quote with PDF path
    await prisma.quote.update({
      where: { id: quote.id },
      data: { pdfPath }
    })

    // Send email
    await sendQuoteEmail(clientEmail, clientName, quoteNumber, pdfPath)

    return NextResponse.json({
      message: 'Quote created successfully',
      quoteNumber,
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
