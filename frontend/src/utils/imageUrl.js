const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const imageUrl = (image) => {
  if (!image) return "";
  // Cloudinary URL
  if (image.startsWith("http")) {
    return image;
  }
  // Local uploads 
  return `${BASE_URL}/uploads/${image}`;
};

export default imageUrl;