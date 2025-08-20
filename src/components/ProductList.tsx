// src/components/ProductList.tsx
"use client";

import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

export default function ProductList({ products }: { products: any[] }) {
  const router = useRouter();

  const handleDelete = async (productId: string) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete product.");
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error deleting product.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Current Products</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <img src={product.imageUrl} alt={product.name} width={60} height={60} className="rounded-md" />
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 transition-colors">
              <FaTrash size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}