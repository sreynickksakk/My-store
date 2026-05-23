"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService"; 

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await login({ username, password });
            localStorage.setItem("admin_user", JSON.stringify(user));

            router.push("/admin");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Admin Login
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border p-2.5 rounded text-gray-700 focus:outline-blue-500"
                            placeholder="Enter admin username"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border p-2.5 rounded text-gray-700 focus:outline-blue-500"
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded font-medium transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}