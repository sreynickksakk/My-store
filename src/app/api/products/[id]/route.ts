import { prisma } from "@/lib/prisma";

// UPDATE PRODUCT
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const body = await request.json();

    const updated = await prisma.product.update({
        where: { id: Number(params.id) },
        data: {
            name: body.name,
            price: Number(body.price),
            image: body.image,
        },
    });

    return Response.json(updated);
}

// DELETE PRODUCT
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    await prisma.product.delete({
        where: { id: Number(params.id) },
    });

    return Response.json({ message: "Deleted successfully" });
}