import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/admin/login"];

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // ① ពិនិត្យថា path នេះត្រូវការ login ឬទេ
    const isPublicPath = PUBLIC_PATHS.some(p => pathname.startsWith(p));

    // ② អានតម្លៃ cookie
    const token = request.cookies.get("admin_token")?.value;

    // ③ Logic redirect
    if (!isPublicPath && !token) {
        // មិន login + ចូល protected page → redirect ទៅ login
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (isPublicPath && token) {
        // login រួចហើយ + ចូល login page → redirect ទៅ dashboard
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

// ④ កំណត់ path ណាដែល middleware ត្រូវ run
export const config = {
    matcher: ["/admin/:path*"],
};