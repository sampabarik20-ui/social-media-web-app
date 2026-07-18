const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const imageUrl = (fileName) => {
  if (!fileName) return "";

  return `${BASE_URL}/uploads/${fileName}`;
};

export default imageUrl;