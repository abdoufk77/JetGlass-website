import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.companySettings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, address, phone, email, website, logo, tvaRate, paymentTerms, deliveryTerms, legalNotice } = data

    // Check if settings exist
    const existingSettings = await prisma.companySettings.findFirst()

    let settings
    if (existingSettings) {
      settings = await prisma.companySettings.update({
        where: { id: existingSettings.id },
        data: {
          name,
          address,
          phone,
          email,
          website,
          logo,
          tvaRate: parseFloat(tvaRate),
          paymentTerms,
          deliveryTerms,
          legalNotice
        }
      })
    } else {
      settings = await prisma.companySettings.create({
        data: {
          name,
          address,
          phone,
          email,
          website,
          logo,
          tvaRate: parseFloat(tvaRate),
          paymentTerms,
          deliveryTerms,
          legalNotice
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
