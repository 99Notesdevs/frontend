import { env } from "./env";

export const uploadImageToS3 = async (
  formData: FormData,
  folder: string,
  name?: string
): Promise<string | null> => {
  const res = await fetch(
    `${env.API}/aws/upload-image?folder=${folder}&name=${name}`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );
  const result = await res.json();
  if (!res.ok) return null;

  return result.data || null;
};
