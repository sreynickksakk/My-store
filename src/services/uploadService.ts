const BASE = "/api/upload";

export type UploadResult = {
    url: string;
};

// Upload image
export async function uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(BASE, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Failed to upload image");
    return res.json();
}