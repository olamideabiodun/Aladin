"use client";

import { useState } from "react";
import Image from "next/image";
import { FaShoppingCart, FaStar } from "react-icons/fa";

export default function ProductCard({ product }: { product: any }) {
  const [rating, setRating] = useState(0);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const handleRateProduct = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, value: rating }),
      });
      if (!res.ok) throw new Error("Failed to submit rating.");
      alert("Thanks for rating this product!");
    } catch (error) {
      console.error(error);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg p-4 bg-white flex flex-col items-center">
      {/* Updated image container with explicit dimensions */}
      <div className="relative w-full aspect-square max-w-[200px] mx-auto">
        <Image 
          src={product.imageUrl} 
          alt={product.name} 
          width={200} // Explicitly set width
          height={200} // Explicitly set height
          className="rounded-md"
        />
      </div>
      <h3 className="text-xl font-bold mt-4">{product.name}</h3>
      <p className="text-gray-700">${product.price.toFixed(2)}</p>
      
      <div className="flex items-center mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      
      <div className="flex flex-col gap-2 mt-4 w-full">
        <button onClick={handleAddToCart} className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600">
          <FaShoppingCart className="mr-2" /> Add to Cart
        </button>
        <button onClick={handleRateProduct} className="flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-300">
          <FaStar className="mr-2" /> Submit Rating
        </button>
      </div>
    </div>
  );
}