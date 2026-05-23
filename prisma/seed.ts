import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seeding...");

  
    const createProductPerm = await prisma.permission.upsert({
        where: { name: "CREATE_PRODUCT" },
        update: {},
        create: { name: "CREATE_PRODUCT" },
    });

    const deleteProductPerm = await prisma.permission.upsert({
        where: { name: "DELETE_PRODUCT" },
        update: {},
        create: { name: "DELETE_PRODUCT" },
    });

    console.log("✅ Permissions created");

   
    const superAdminRole = await prisma.role.upsert({
        where: { name: "SUPER_ADMIN" },
        update: {},
        create: { name: "SUPER_ADMIN" },
    });

    console.log("✅ Role SUPER_ADMIN created");

    
    await prisma.rolePermission.upsert({
        where: {
            roleId_permissionId: {
                roleId: superAdminRole.id,
                permissionId: createProductPerm.id,
            },
        },
        update: {},
        create: {
            roleId: superAdminRole.id,
            permissionId: createProductPerm.id,
        },
    });

    await prisma.rolePermission.upsert({
        where: {
            roleId_permissionId: {
                roleId: superAdminRole.id,
                permissionId: deleteProductPerm.id,
            },
        },
        update: {},
        create: {
            roleId: superAdminRole.id,
            permissionId: deleteProductPerm.id,
        },
    });

    console.log("✅ Permissions linked to Role");


    const hashedPassword = await bcrypt.hash("admin123", 10);

    
    const adminUser = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: hashedPassword,
            roleId: superAdminRole.id,
        },
    });

    console.log(`✅ Admin user created! Username: ${adminUser.username} | Password: admin123`);
    console.log("🌲 Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });