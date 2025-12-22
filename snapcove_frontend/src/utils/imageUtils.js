/**
 * Normalize image URL from backend
 * Handles both relative and absolute URLs
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Ensure it starts with / for relative paths
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Construct full URL
  return `http://localhost:8000${normalizedPath}`;
};

