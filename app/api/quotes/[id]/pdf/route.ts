import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateQuotePDF } from '@/lib/pdf'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Get the quote with products
    const quote = await prisma.quote.findUnique({
      where: { id },
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
      where: { id },
      data: { pdfPath }
    })

    return NextResponse.json({
      message: 'PDF generated successfully',
      pdfPath
    }, { status: 200 })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
