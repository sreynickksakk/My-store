"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; 

type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
};

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("API did not return an array:", data);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Failed to load products", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="px-10 py-12">
            <h2 className="text-2xl font-bold mb-6">Products</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white p-4 rounded shadow flex flex-col justify-between"
                        >
                           
                            <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                    {product.name}
                                </h3>

                                <p className="text-gray-600 font-medium mt-1">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>

                            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}