"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!file) {
      setMessage("Error: Please select an image file.");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload the image file first
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image.");
      }
      
      const uploadData = await uploadRes.json();
      const uploadedImageUrl = uploadData.imageUrl;

      // 2. Then, create the product record with the new image URL
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: uploadedImageUrl,
      };

      const productRes = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!productRes.ok) {
        throw new Error("Failed to add product record.");
      }

      setMessage("Product added successfully!");
      setFormData({ name: "", description: "", price: "" });
      setFile(null);
      router.refresh();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      {message && <p className={`mb-4 text-center ${message.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" className="w-full mt-1 p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Product Image</label>
        <input type="file" name="file" onChange={handleFileChange} required className="w-full mt-1 p-2 border rounded-md" />
      </div>
      
      <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-600 disabled:bg-gray-400">
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}