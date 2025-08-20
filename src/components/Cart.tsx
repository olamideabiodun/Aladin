"use client";

import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import CheckoutButton from "./CheckoutButton";

export default function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateCart = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (id: string) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-4">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} width={50} height={50} className="rounded" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center font-bold text-xl">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="mt-6 text-center">
            <CheckoutButton cart={cartItems} />
          </div>
        </>
      )}
    </div>
  );
}