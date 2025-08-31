export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    const products = await prisma.product.findMany({
      where: includeInactive ? {} : { active: true },
      select: {
        id: true,
        name: true,
        reference: true,
        categoryId: true,
        basePricePerM2: true,
        complexityFactor: true,
        thicknessFactor: true,
        minPrice: true,
        active: true,
        dimensions: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { reference, name, description, categoryId, basePricePerM2, complexityFactor, thicknessFactor, minPrice, dimensions, image, active } = data

    const product = await prisma.product.create({
      data: {
        reference,
        name,
        description,
        categoryId,
        basePricePerM2,
        complexityFactor,
        thicknessFactor,
        minPrice,
        dimensions,
        image,
        active
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
