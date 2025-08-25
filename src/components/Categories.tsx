
import prisma from '@/lib/prisma';
import { Headphones, Shirt, Laptop, Armchair } from 'lucide-react'; // Example icons


const Categories = async () => {
  const categories = await prisma.category.findMany({
    take: 4, // Fetch the first 4 categories
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4">Popular Categories</h3>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="text-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
            <p className="font-medium text-sm">{category.name}</p>
            <p className="text-xs text-gray-600">{category._count.products} Items Available</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;