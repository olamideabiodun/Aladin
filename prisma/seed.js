const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create fabric categories
  const categories = [
    { name: 'Silk' },
    { name: 'Cotton' },
    { name: 'Wool' },
    { name: 'Linen' },
    { name: 'Bamboo' },
    { name: 'Hemp' },
    { name: 'Modal' },
    { name: 'Viscose' },
    { name: 'Chiffon' },
    { name: 'Satin' },
    { name: 'Canvas' },
    { name: 'Jersey' }
  ]

  console.log('Creating fabric categories...')
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }


  // Get categories for product creation
  const silkCategory = await prisma.category.findUnique({ where: { name: 'Silk' } })
  const cottonCategory = await prisma.category.findUnique({ where: { name: 'Cotton' } })
  const woolCategory = await prisma.category.findUnique({ where: { name: 'Wool' } })

  // Use a single seller ID from Clerk (set this in your .env as SELLER_USER_ID)
  const sellerId = process.env.SELLER_USER_ID
  if (!sellerId) {
    throw new Error('SELLER_USER_ID is not set. Please add SELLER_USER_ID to your .env with the Clerk user ID of the seller.')
  }

  // Create sample fabric products
  const products = [
    {
      name: 'Premium Silk Chiffon',
      description: 'Luxurious silk chiffon with an elegant drape that flows beautifully, perfect for creating stunning evening wear and formal garments.',
      price: 89.99,
      offerPrice: 79.99,
      image: ['/assets/alad3.jpg', '/assets/alad7.jpg', '/assets/alad5.jpg', '/assets/alad2.jpg'],
      categoryId: silkCategory?.id,
      sellerId: sellerId,
      stock: 50,
      fabricType: 'Silk',
      color: 'Ivory',
      weight: 'Light',
      width: 45.0,
    },
    {
      name: 'Organic Cotton Jersey',
      description: 'Eco-friendly organic cotton jersey that combines sustainability with comfort. Perfect for casual wear and comfortable everyday clothing.',
      price: 34.99,
      offerPrice: 29.99,
      image: ['/assets/alad4.jpg'],
      categoryId: cottonCategory?.id,
      sellerId: sellerId,
      stock: 100,
      fabricType: 'Cotton',
      color: 'Natural',
      weight: 'Medium',
      width: 60.0,
    },
    {
      name: 'Cashmere Wool',
      description: 'Ultra-soft cashmere wool that provides exceptional warmth and luxury. Perfect for winter garments and high-end fashion pieces.',
      price: 129.99,
      offerPrice: 119.99,
      image: ['/assets/alad1.jpg'],
      categoryId: woolCategory?.id,
      sellerId: sellerId,
      stock: 25,
      fabricType: 'Wool',
      color: 'Cream',
      weight: 'Heavy',
      width: 50.0,
    },
  ]

  console.log('Creating sample fabric products...')
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
