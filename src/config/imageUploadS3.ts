export const uploadImageToS3 = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  return data.url
}