'use client';

import { useState } from 'react';

export default function UploadTest() {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch(`/api/upload?filename=${file.name}`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const data = await response.json();
          return data.url;
        })
      );

      setUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>비디오 업로드 테스트</h1>
      <input
        type="file"
        accept="video/mp4"
        multiple
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>업로드 중...</p>}
      {urls.length > 0 && (
        <div>
          <h2>업로드된 비디오 URL:</h2>
          <ul>
            {urls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 