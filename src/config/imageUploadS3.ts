import { api } from "./api/route";

export const uploadImageToS3 = async (
  formData: FormData,
  folder: string,
  name?: string
): Promise<string | null> => {
  const res = (await api.post(
    `/aws/upload-image?folder=${folder}&name=${name}`,
    formData
  )) as { success: boolean; data: string };

  if (!res.success) return null;

  return res.data || null;
};
