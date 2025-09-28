import { NextResponse } from 'next/server'
import { productService } from '@/lib/database'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import crypto from 'node:crypto'
import authSeller from '@/lib/authSeller'

// GET /api/products - Get all products with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let result

    if (search) {
      result = await productService.searchProducts(search, page, limit)
    } else {
      result = await productService.getAllProducts(page, limit, category)
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (seller only)
export async function POST(request) {
  try {
    const productData = await request.json()

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const isSeller = await authSeller(userId)
    if (!isSeller) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { name, description, price, offerPrice, image, categoryName, fabricType, color, weight, width } = productData

    if (!name || !description || typeof price !== 'number' || !categoryName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    try {
      const client = await clerkClient()
      const clerkUser = await client.users.getUser(userId)
      const primaryEmail = clerkUser?.emailAddresses?.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
        || clerkUser?.emailAddresses?.[0]?.emailAddress
        || `${userId}@example.com`
      const displayName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ')
        || clerkUser?.username
        || primaryEmail

      await prisma.user.upsert({
        where: { id: userId },
        update: { name: displayName, email: primaryEmail },
        create: {
          id: userId,
          name: displayName || 'Seller',
          email: primaryEmail,
          password: crypto.randomUUID(),
          role: 'SELLER'
        }
      })
    } catch (e) {
      console.error('Failed to ensure local seller user:', e)
      return NextResponse.json({ success: false, error: 'Failed to prepare seller' }, { status: 500 })
    }

    const baseData = {
      name,
      description,
      price,
      image: Array.isArray(image) ? image : [],
      
      seller: {
        connect: { id: userId }
      },
      // Connect or create the fabric category by name
      category: {
        connectOrCreate: {
          where: { name: categoryName },
          create: { name: categoryName }
        }
      }
    }

    const optionalData = {
      ...(typeof offerPrice === 'number' ? { offerPrice } : {}),
      ...(fabricType ? { fabricType } : {}),
      ...(color ? { color } : {}),
      ...(weight ? { weight } : {}),
      ...(typeof width === 'number' ? { width } : {}),
    }

    const product = await productService.createProduct({
      ...baseData,
      ...optionalData,
    })

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
