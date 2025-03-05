import { put } from '@vercel/blob';

export async function uploadVideo(file: File) {
  const { url } = await put(file.name, file, {
    access: 'public',
    contentType: 'video/mp4',
  });
  return url;
} 