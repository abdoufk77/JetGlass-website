import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
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
