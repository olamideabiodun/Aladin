import { Search, ShoppingCart, User, ChevronDown, Filter } from "lucide-react";

import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import Link from "next/link";
import { auth } from "@/lib/auth"; 

export default async function Home() {
  // Fetch products from the database
  const products = await prisma.product.findMany();

  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Banner (static, unchanged) */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div>
                  <h1 className="text-4xl font-bold text-emerald-800 mb-4">
                    Grab Upto 50% Off On Selected Headphone
                  </h1>
                  <button className="bg-emerald-800 text-white px-6 py-3 rounded-lg font-medium">
                    Buy Now
                  </button>
                </div>
                <div className="flex justify-center">
                  <img
                    src="https://img.freepik.com/free-photo/headphone-isolated-pink-background_1303-36605.jpg?w=1380"
                    alt="Woman with headphones"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Filters (optional, can be made functional later) */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span>Headphone Type</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span>Price</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span>Review</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span>Sort by</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Products Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Products For You!</h2>
              {products.length === 0 ? (
                <p>No products found. Please add some from the admin dashboard.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Map over products fetched from the database */}
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary / Cart */}
            <Cart />

            {/* Other Sidebar elements can be added here, but for now we simplify */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Popular Categories</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🪑</div>
                    <p className="font-medium text-sm">Furniture</p>
                    <p className="text-xs text-gray-600">3K+ Item Available</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🎧</div>
                    <p className="font-medium text-sm">Headphone</p>
                    <p className="text-xs text-gray-600">3K+ Item Available</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">👟</div>
                    <p className="font-medium text-sm">Shoe</p>
                    <p className="text-xs text-gray-600">3K+ Item Available</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">👜</div>
                    <p className="font-medium text-sm">Bag</p>
                    <p className="text-xs text-gray-600">3K+ Item Available</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}