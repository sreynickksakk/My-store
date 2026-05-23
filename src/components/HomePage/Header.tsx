'use client';

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
            <h1 className="text-2xl font-bold​ text-blue-600">MyShop 🛒</h1>
            <div className="space-x-6 text-gray-600">
                <a href="#">Home</a>
                <a href="#">Products</a>
                <a href="#">Cart</a>
                <a href="#">Login</a>
            </div>
        </nav>
    );
}
