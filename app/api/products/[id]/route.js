import { NextResponse } from 'next/server'
import { productService } from '@/lib/database'

// GET /api/products/[id] - Get product by ID
export async function GET(request, ctx) {
  try {
    const { id } = await ctx.params
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product id is required' },
        { status: 400 }
      )
    }
    
    const product = await productService.getProductById(id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (seller only)
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const updateData = await request.json()
    
    // TODO: Add authentication check for seller role
    // TODO: Add validation for update data
    
    const product = await productService.updateProduct(id, updateData)

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (seller only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // TODO: Add authentication check for seller role
    
    await productService.deleteProduct(id)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
