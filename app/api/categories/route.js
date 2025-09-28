import { NextResponse } from 'next/server'
import { categoryService } from '@/lib/database'

// GET /api/categories - Get all categories
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    let result

    if (name) {
      result = await categoryService.getCategoryByName(name)
    } else {
      result = await categoryService.getAllCategories()
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
