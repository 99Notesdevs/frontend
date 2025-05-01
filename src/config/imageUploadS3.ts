import { env } from "./env";
import Cookies from "js-cookie";

const token = Cookies.get('token') || null;

export const uploadImageToS3 = async (formData: FormData, folder: string): Promise<string | null> => {

  const res = await fetch(`${env.API}/aws/upload-image?folder=${folder}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) return null;

  const { data } = await res.json();
  return data || null;
};