import { env } from "./env";

export const uploadImageToS3 = async (
  formData: FormData,
  folder: string,
  name?: string
): Promise<string | null> => {
  const params = new URLSearchParams();
  params.set("folder", folder);
  if (name) params.set("name", name);

  const res = await fetch(`${env.API}/aws/upload-image?${params.toString()}`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) return null;

  return result.data || null;
};
