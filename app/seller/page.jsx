'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const AddProduct = () => {

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Silk');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [width, setWidth] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      // Upload images first if provided
      let uploadedUrls = []
      const nonEmptyFiles = files.filter(Boolean)
      if (nonEmptyFiles.length > 0) {
        const formData = new FormData()
        nonEmptyFiles.forEach((f) => formData.append('files', f))
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok || !uploadData?.success) {
          throw new Error(uploadData?.error || 'Image upload failed')
        }
        uploadedUrls = uploadData.files || []
      }

      const payload = {
        name,
        description,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        image: uploadedUrls,
        categoryName: category,
        fabricType: category,
        color: color || null,
        weight: weight || null,
        width: width ? parseFloat(width) : null,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to add product');
      }

      setFiles([]);
      setName('');
      setDescription('');
      setCategory('Silk');
      setPrice('');
      setOfferPrice('');
      setColor('');
      setWeight('');
      setWidth('');
      alert('Product added successfully');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Fabric Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Silk">Silk</option>
              <option value="Cotton">Cotton</option>
              <option value="Wool">Wool</option>
              <option value="Linen">Linen</option>
              <option value="Bamboo">Bamboo</option>
              <option value="Hemp">Hemp</option>
              <option value="Modal">Modal</option>
              <option value="Viscose">Viscose</option>
              <option value="Chiffon">Chiffon</option>
              <option value="Satin">Satin</option>
              <option value="Canvas">Canvas</option>
              <option value="Jersey">Jersey</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="fabric-color">
              Color
            </label>
            <input
              id="fabric-color"
              type="text"
              placeholder="e.g., Ivory"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setColor(e.target.value)}
              value={color}
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="fabric-weight">
              Weight
            </label>
            <select
              id="fabric-weight"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
            >
              <option value="">Select</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Heavy">Heavy</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="fabric-width">
              Width
            </label>
            <input
              id="fabric-width"
              type="number"
              placeholder="inches/cm"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setWidth(e.target.value)}
              value={width}
              step="0.01"
              min="0"
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={submitting} className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60">
          {submitting ? 'ADDING...' : 'ADD'}
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;