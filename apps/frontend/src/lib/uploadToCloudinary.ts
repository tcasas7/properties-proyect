export async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/dwrhf93ct/image/upload`;
  const preset = "propiedades_preset";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", "propiedades"); 

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error?.message || "Cloudinary upload failed");

  return data.secure_url;
}
