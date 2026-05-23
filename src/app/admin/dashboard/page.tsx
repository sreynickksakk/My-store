"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct, getProducts, deleteProduct, Product } from "@/services/productService";

export default function AdminPage() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, logout } = useAuth();

    // ① Load products from api
    const loadProducts = async () => {
        try {
            setFetchLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        setPreview(file ? URL.createObjectURL(file) : "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return alert("Please select an image!");
        setLoading(true);
        try {
            await createProduct({ name, price, image });
            alert("✅ Product added!");
            setName(""); setPrice(""); setImage(null); setPreview("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            // ② Reload list afer adding new product
            await loadProducts();
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            // ③ delete from state no reload
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            alert(`❌ ${err.message}`);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col p-4 gap-1">
                <div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100">
                    <span className="text-blue-600 text-xl">🛍️</span>
                    <span className="font-medium text-gray-800">my-store</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider px-2 py-2">Main</p>
                <a href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                    📊 Dashboard
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm">
                    📦 Products
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm">
                    🛒 Orders
                </a>
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{user?.username}</p>
                            <p className="text-xs text-gray-400">{user?.role}</p>
                        </div>
                        <button onClick={logout} className="text-gray-400 hover:text-red-500 text-sm">⬅️</button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="ml-56 flex-1 p-8">
                <div className="flex items-center justify-between mb-7">
                    <div>
                        <h1 className="text-lg font-medium text-gray-800">Dashboard</h1>
                        <p className="text-sm text-gray-400">Welcome back, {user?.username}</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Products", value: String(products.length), badge: "total", up: true },
                        { label: "Orders", value: "124", badge: "+12%", up: true },
                        { label: "Customers", value: "320", badge: "+5%", up: true },
                        { label: "Revenue", value: "$8,420", badge: "-2%", up: false },
                    ].map((m) => (
                        <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                            <p className="text-xl font-medium text-gray-800">{m.value}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                                }`}>
                                {m.badge}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">

                    {/* Add Product Form */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5">
                        <h2 className="text-sm font-medium text-gray-800 mb-4">Add Product</h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Product name</label>
                                <input
                                    type="text" value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400"
                                    placeholder="e.g. Running Shoes" required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Price ($)</label>
                                <input
                                    type="number" value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400"
                                    placeholder="0.00" required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Image</label>
                                <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100">
                                    {preview
                                        ? <img src={preview} className="w-20 h-20 object-cover rounded-lg" alt="preview" />
                                        : <>
                                            <span className="text-2xl mb-1">☁️</span>
                                            <span className="text-xs text-gray-400">Click to upload</span>
                                        </>
                                    }
                                    <input
                                        type="file" accept="image/*"
                                        ref={fileInputRef} onChange={handleImageChange}
                                        className="hidden" required
                                    />
                                </label>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {loading ? "Adding..." : "Add Product"}
                            </button>
                        </form>
                    </div>

                    {/* Recent Products — Real Data */}
                    <div className="bg-white border border-gray-100 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-medium text-gray-800">
                                Recent Products
                                <span className="ml-2 text-xs text-gray-400">({products.length})</span>
                            </h2>
                            <a href="#" className="text-xs text-blue-600">View all →</a>
                        </div>

                        {/* Loading State */}
                        {fetchLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 py-2">
                                        <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse" />
                                        <div className="flex-1 space-y-1">
                                            <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                                            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ) : products.length === 0 ? (
                            // Empty State
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <span className="text-3xl mb-2">📦</span>
                                <p className="text-sm text-gray-500">No products yet</p>
                                <p className="text-xs text-gray-400">Add your first product using the form</p>
                            </div>

                        ) : (
                            
                            <div className="space-y-1">
                                {products.slice(-5).reverse().map((p) => (
                                    <div key={p.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                                        <div className="w-9 h-9 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "";
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate">{p.name}</p>
                                            <p className="text-xs text-gray-400">${p.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 text-xs transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}