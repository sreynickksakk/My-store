const BASE = "/api/products";

export type Product = {
    id: number;
    name: string;
    price: number;
    image: string;
    createdAt: string;
};

export type CreateProductData = {
    name: string;
    price: string;
    image: File;
};

// GET all products
export async function getProducts(): Promise<Product[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

// GET single product
export async function getProductById(id: number): Promise<Product> {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error("Product not found");
    return res.json();
}

// CREATE product
export async function createProduct(data: CreateProductData): Promise<Product> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("image", data.image);

    const res = await fetch(BASE, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Failed to create product");
    return res.json();
}

// UPDATE product
export async function updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    const res = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
}

// DELETE product
export async function deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
}