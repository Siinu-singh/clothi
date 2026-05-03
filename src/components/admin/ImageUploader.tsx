'use client';
import { useState, useRef } from 'react';
import { CollectionImage } from '@/models/collection';

interface ImageUploaderProps {
  onImagesChange: (images: CollectionImage[]) => void;
  initialImages?: CollectionImage[];
  maxImages?: number;
}

export default function ImageUploader({
  onImagesChange,
  initialImages = [],
  maxImages = 5,
}: ImageUploaderProps) {
  const [images, setImages] = useState<CollectionImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  // Initialize Cloudinary widget
  const initializeCloudinary = () => {
    if (typeof window !== 'undefined' && !cloudinaryRef.current) {
      const script = document.createElement('script');
      script.src = 'https://upload.cloudinary.com/pages/cloudinary_js/2.0/cloudinary.min.js';
      script.async = true;
      script.onload = () => {
        cloudinaryRef.current = (window as any).cloudinary;
      };
      document.head.appendChild(script);
    }
  };

  const openCloudinaryWidget = () => {
    initializeCloudinary();
    if (cloudinaryRef.current && !widgetRef.current) {
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          multiple: true,
          maxFiles: maxImages - images.length,
          folder: 'clothi/collections',
          resourceType: 'image',
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary error:', error);
            setError(error.message || 'Upload failed');
            return;
          }

          if (result?.event === 'success') {
            const newImage: CollectionImage = {
              url: result.info.secure_url,
              alt: result.info.public_id || 'Collection image',
              isMain: images.length === 0, // First image is main
              order: images.length,
            };
            const updatedImages = [...images, newImage];
            setImages(updatedImages);
            onImagesChange(updatedImages);
            setError(null);
          }
        }
      );
    }
    widgetRef.current?.open();
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Reorder and set new main image if needed
    if (updatedImages.length > 0 && images[index].isMain) {
      updatedImages[0].isMain = true;
    }
    updatedImages.forEach((img, idx) => (img.order = idx));
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const setMainImage = (index: number) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      isMain: idx === index,
    }));
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [removed] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, removed);
    updatedImages.forEach((img, idx) => (img.order = idx));
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Collection Images</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          type="button"
          onClick={openCloudinaryWidget}
          disabled={images.length >= maxImages || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {uploading ? 'Uploading...' : `Add Images (${images.length}/${maxImages})`}
        </button>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.alt}
                  className={`w-full h-32 object-cover rounded-md border-2 ${
                    image.isMain
                      ? 'border-blue-500'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}
                />

                {image.isMain && (
                  <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-md transition flex items-center justify-center gap-2">
                  {!image.isMain && (
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      title="Set as main image"
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded text-sm"
                    >
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <p className="text-xs text-gray-500 mt-2">
              Drag to reorder images (coming soon)
            </p>
          )}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500">No images uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Images" to get started</p>
        </div>
      )}
    </div>
  );
}
