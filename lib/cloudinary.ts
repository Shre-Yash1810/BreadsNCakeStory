import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Checks if a string is a base64 data URI
 */
export function isBase64Image(str: any): boolean {
  return typeof str === 'string' && str.startsWith('data:image/');
}

/**
 * Uploads a base64 image string to Cloudinary
 * @param base64String Base64 image data URI
 * @param folder Cloudinary folder name
 */
export async function uploadToCloudinary(base64String: string, folder = 'breads_cakestory'): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || 
      cloudName === 'your_cloud_name' || 
      apiKey === 'your_api_key' || 
      apiSecret === 'your_api_secret') {
    throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.');
  }
  
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder,
    });
    return result.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message || error}`);
  }
}
