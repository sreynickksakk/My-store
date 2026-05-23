const BASE = "/api/admin";

export type LoginData = {
    username: string;
    password: string;
};

export type AuthUser = {
    id: number;
    username: string;
    role: string;
    permissions: string[];
    createdAt: string;
};

export async function login(data: LoginData): Promise<AuthUser> {
    const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Login failed");
    return json.user;
}

export async function logout(): Promise<void> {
    await fetch(`${BASE}/logout`, { method: "POST" });
}