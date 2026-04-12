// src/lib/upload.ts

/**
 * Uploads an image and returns a data URI (for client-side storage)
 * In production, replace this with actual cloud storage (AWS S3, Cloudinary, etc.)
 */
export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const result = reader.result as string;
      console.log('Image converted to data URI, length:', result.length);
      resolve(result);
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Validates an image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'Image must be less than 5MB' };
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }
  
  return { valid: true };
}