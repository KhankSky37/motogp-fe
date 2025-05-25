export const getImageUrl = (photoPath) => {
  if (!photoPath) return null;

  // Best Practice: Get base URL from environment variables
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9096'; // Fallback for example
  // const pathPrefix = '/api/v1'; // Assuming this prefix is constant

  // Ensure no double slashes and path starts correctly
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const relativePath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;

  return `${cleanBaseUrl}${relativePath}`;
};
