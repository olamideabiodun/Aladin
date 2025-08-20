// src/components/CheckoutButton.tsx
'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function CheckoutButton({ cart }) {
  const handleCheckout = () => {
    // Encode cart data into a URL-safe string
    const cartDetails = cart.products.map(item => `${item.product.name} x${item.quantity}`).join(', ');
    const message = `Hello, I would like to place an order for the following items: ${cartDetails}.`;
    const whatsappUrl = `https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button onClick={handleCheckout} className="flex items-center bg-green-500 text-white px-6 py-3 rounded-full">
      <FaWhatsapp className="mr-2" /> Checkout via WhatsApp
    </button>
  );
}