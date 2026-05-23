import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function GET() {
  try {
    const products = await prisma.product.findMany();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

// CREATE PRODUCT
export async function POST(request: Request) {
  console.log("Cloudinary config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    has_secret: !!process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const image = formData.get("image") as File;

    if (!image || image.size === 0) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }


    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);


    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {},
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });


    const imageUrl = uploadResult.secure_url;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        image: imageUrl,
      },
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload image to cloud" },
      { status: 500 }
    );
  }
}