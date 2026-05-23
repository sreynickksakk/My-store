
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: { permission: true }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "គណនីនេះមិនមានក្នុងប្រព័ន្ធទេ!" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ!" },
                { status: 401 }
            );
        }

        const userPermissions = user.role.permissions.map(
            (rp: any) => rp.permission.name
        );

        const userData = {
            id: user.id,
            username: user.username,
            role: user.role.name,
            permissions: userPermissions,
            createdAt: user.createdAt,
        };

        const response = NextResponse.json({ success: true, user: userData });

        response.cookies.set("admin_token", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, 
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}