/**
 * Utility functions for handling image URLs
 */

/**
 * Get direct image URL from Cloudinary URL if needed
 * @param {string} url - The image URL
 * @returns {string} Processed image URL
 */
/**
 * Get direct image URL from Cloudinary URL if needed
 * @param {string} url - The image URL
 * @returns {string} Processed image URL
 */
export const getDirectImageUrl = (url) => {
  if (!url) {
    console.warn('No URL provided to getDirectImageUrl');
    return '';
  }
  
  try {
    // If it's already a data URL or blob URL, return as is
    if (typeof url !== 'string' || url.startsWith('data:image') || url.startsWith('blob:')) {
      return url;
    }

    // If it's a Cloudinary URL, ensure it's using https
    if (url.includes('res.cloudinary.com')) {
      // Remove any query parameters for consistency
      const cleanUrl = url.split('?')[0];
      
      // Ensure it's using https
      if (cleanUrl.startsWith('http://')) {
        return cleanUrl.replace('http://', 'https://');
      } else if (cleanUrl.startsWith('//')) {
        return `https:${cleanUrl}`;
      } else if (!cleanUrl.startsWith('http')) {
        return `https://${cleanUrl}`;
      }
      return cleanUrl; // Already https
    }

    // If it's a relative path, convert to absolute URL
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }

    // If it's already a full URL, return as is
    if (url.startsWith('http')) {
      return url;
    }

    console.warn('Unhandled URL format in getDirectImageUrl:', url);
    return url;
  } catch (error) {
    console.error('Error processing image URL:', error, { url });
    return '';
  }
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
