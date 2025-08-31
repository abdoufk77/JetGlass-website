export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// import { generateQuotePDF } from '@/lib/pdf' // Temporarily disabled

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

    // TODO: Implement PDF generation logic here
    // For now, return a placeholder response to avoid build errors
    const pdfPath = `/temp/quote-${id}.pdf` // Placeholder path

    // Update quote with PDF path (commented out for now)
    // await prisma.quote.update({
    //   where: { id },
    //   data: { pdfPath }
    // })

    return NextResponse.json({
      message: 'PDF generation endpoint ready (implementation pending)',
      pdfPath,
      note: 'This is a placeholder response to fix build errors'
    }, { status: 200 })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
