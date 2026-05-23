"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

type Permission = string;

type User = {
    id: number;
    username: string;
    role: string;
    permissions: Permission[];
    createdAt: string;
};

type AuthContextType = {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    
    useEffect(() => {
        const stored = localStorage.getItem("admin_user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("admin_user");
            }
        }
    }, []);

    
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "admin_user" && !e.newValue) {
                setUser(null);
                router.replace("/admin/login");
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = async (username: string, password: string) => {
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        // រក្សា user ក្នុង localStorage
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        setUser(data.user);
        router.push("/admin/dashboard"); 
    };

    const logout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        localStorage.removeItem("admin_user");
        setUser(null);
        router.replace("/admin/login");
    };

    const hasPermission = (permission: string): boolean => {
        if (!user) return false;
        if (user.role === "SUPER_ADMIN") return true;
        return user.permissions.includes(permission);
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}