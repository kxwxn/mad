import { supabase } from './supabase';

export async function uploadProductImage(file: File) {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // 파일 크기 체크 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large (max 10MB)');
    }

    // 허용된 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }

    // 파일 경로 생성
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('Attempting to upload file:', {
      fileName,
      fileType: file.type,
      fileSize: file.size,
      bucketPath: filePath
    });

    // 파일 업로드
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')  // 버킷 이름이 정확한지 확인
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw uploadError;
    }

    if (!data) {
      throw new Error('Upload successful but no data returned');
    }

    // 업로드된 파일의 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log('Upload successful, public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Detailed upload error:', error);
    throw error;
  }
}