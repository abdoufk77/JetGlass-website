export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

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
    console.log('Received data:', data)
    
    const { name, address, phone, email, website, logo, description, facebookUrl, twitterUrl, linkedinUrl, instagramUrl, workingHours, tvaRate, paymentTerms, deliveryTerms, legalNotice } = data

    // Check if settings exist
    const existingSettings = await prisma.companySettings.findFirst()
    console.log('Existing settings:', existingSettings)

    let settings
    if (existingSettings) {
      // Use raw SQL for update to avoid TypeScript issues
      settings = await prisma.$executeRaw`
        UPDATE company_settings SET 
          name = ${name || 'JetGlass'},
          address = ${address || ''},
          phone = ${phone || ''},
          email = ${email || ''},
          website = ${website || ''},
          logo = ${logo || ''},
          description = ${description || 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans'},
          facebookUrl = ${facebookUrl || ''},
          twitterUrl = ${twitterUrl || ''},
          linkedinUrl = ${linkedinUrl || ''},
          instagramUrl = ${instagramUrl || ''},
          workingHours = ${workingHours || 'Lundi - Vendredi: 8h00 - 18h00'},
          tvaRate = ${tvaRate ? parseFloat(tvaRate) : 20.0},
          paymentTerms = ${paymentTerms || ''},
          deliveryTerms = ${deliveryTerms || ''},
          legalNotice = ${legalNotice || ''},
          updatedAt = datetime('now')
        WHERE id = ${existingSettings.id}
      `
      
      // Fetch the updated record
      settings = await prisma.companySettings.findFirst()
    } else {
      // Use raw SQL for create to avoid TypeScript issues
      await prisma.$executeRaw`
        INSERT INTO company_settings (
          id, name, address, phone, email, website, logo, description,
          facebookUrl, twitterUrl, linkedinUrl, instagramUrl, workingHours,
          tvaRate, paymentTerms, deliveryTerms, legalNotice, createdAt, updatedAt
        ) VALUES (
          'default',
          ${name || 'JetGlass'},
          ${address || ''},
          ${phone || ''},
          ${email || ''},
          ${website || ''},
          ${logo || ''},
          ${description || 'Spécialiste en solutions vitrées sur mesure depuis plus de 20 ans'},
          ${facebookUrl || ''},
          ${twitterUrl || ''},
          ${linkedinUrl || ''},
          ${instagramUrl || ''},
          ${workingHours || 'Lundi - Vendredi: 8h00 - 18h00'},
          ${tvaRate ? parseFloat(tvaRate) : 20.0},
          ${paymentTerms || ''},
          ${deliveryTerms || ''},
          ${legalNotice || ''},
          datetime('now'),
          datetime('now')
        )
      `
      
      settings = await prisma.companySettings.findFirst()
    }

    console.log('Updated settings:', settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
