import { prisma } from './db'

// Product operations
export const productService = {
  // Get all products with pagination
  async getAllProducts(page = 1, limit = 10, category = null) {
    const skip = (page - 1) * limit
    const where = category ? { category: { name: category } } : {}
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { ...where, isActive: true },
        include: {
          category: true,
          seller: {
            select: { name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where: { ...where, isActive: true } })
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  },

  // Get product by ID
  async getProductById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: { name: true, email: true }
        }
      }
    })
  },

  // Create new product
  async createProduct(productData) {
    return prisma.product.create({
      data: productData,
      include: {
        category: true,
        seller: {
          select: { name: true, email: true }
        }
      }
    })
  },

  // Update product
  async updateProduct(id, productData) {
    return prisma.product.update({
      where: { id },
      data: productData,
      include: {
        category: true,
        seller: {
          select: { name: true, email: true }
        }
      }
    })
  },

  // Delete product (soft delete)
  async deleteProduct(id) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false }
    })
  },

  // Search products
  async searchProducts(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { fabricType: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          category: true,
          seller: {
            select: { name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { fabricType: { contains: query, mode: 'insensitive' } }
          ]
        }
      })
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}

// Category operations
export const categoryService = {
  // Get all categories
  async getAllCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { isActive: true } } }
        }
      },
      orderBy: { name: 'asc' }
    })
  },

  // Get category by name
  async getCategoryByName(name) {
    return prisma.category.findUnique({
      where: { name },
      include: {
        products: {
          where: { isActive: true },
          include: {
            seller: {
              select: { name: true, email: true }
            }
          }
        }
      }
    })
  }
}

// Order operations
export const orderService = {
  // Create new order
  async createOrder(orderData) {
    return prisma.order.create({
      data: {
        ...orderData,
        orderItems: {
          create: orderData.orderItems
        }
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        address: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })
  },

  // Get user orders
  async getUserOrders(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          address: true,
          orderItems: {
            include: {
              product: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: { userId } })
    ])

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status, trackingNumber = null) {
    return prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        trackingNumber: trackingNumber || undefined
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        address: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })
  }
}

// User operations
export const userService = {
  // Get user by email
  async getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true,
        orders: {
          include: {
            orderItems: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })
  },

  // Create user address
  async createUserAddress(userId, addressData) {
    return prisma.address.create({
      data: {
        ...addressData,
        userId
      }
    })
  },

  // Get user addresses
  async getUserAddresses(userId) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }
    })
  }
}
