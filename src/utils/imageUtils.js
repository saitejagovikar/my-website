/**
 * Utility functions for handling image URLs
 */

/**
 * Get direct image URL from Cloudinary URL if needed
 * @param {string} url - The image URL
 * @returns {string} Processed image URL
 */
export const getDirectImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a direct URL or data URL, return as is
  if (url.startsWith('http') || url.startsWith('data:image') || url.startsWith('blob:')) {
    return url;
  }
  
  // If it's a Cloudinary URL, ensure it's using https
  if (url.includes('cloudinary.com')) {
    return url.replace('http://', 'https://');
  }
  
  // For local development or other cases, return as is
  return url;
};

/**
 * Get optimized image URL with width and quality parameters
 * @param {string} url - Original image URL
 * @param {Object} options - Options for image optimization
 * @param {number} [options.width] - Desired width of the image
 * @param {number} [options.quality=80] - Image quality (0-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (url, { width, quality = 80 } = {}) => {
  if (!url) return '';
  
  // If it's a Cloudinary URL, add optimization parameters
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/').slice(0, -1).join('/');
    const filename = url.split('/').pop();
    const transformations = [];
    
    if (width) transformations.push(`w_${width}`);  
    if (quality) transformations.push(`q_${quality}`);
    
    if (transformations.length > 0) {
      return `${baseUrl}/${transformations.join(',')}/${filename}`;
    }
  }
  
  return url;
};
