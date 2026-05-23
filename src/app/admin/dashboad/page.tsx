"use client";

import { useState, useRef } from "react";

export default function AdminPage() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null); 
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file)); 
        else setPreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return alert("Please select an image!");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", price);
            formData.append("image", image);

            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to create product");

            alert("✅ Product added successfully!");

            // ✅ Reset
            setName("");
            setPrice("");
            setImage(null);
            setPreview("");
            if (fileInputRef.current) fileInputRef.current.value = ""; 

        } catch (error) {
            console.error(error);
            alert("❌ Failed to add product!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">
                Admin - Add Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow max-w-lg space-y-4 mx-auto"
            >
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded text-gray-500"
                        placeholder="Enter product name"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border p-2 rounded text-gray-500"
                        placeholder="Enter price"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded text-gray-500"
                        required
                    />
                    {/* Preview */}
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-3 w-40 h-40 object-cover rounded border"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}