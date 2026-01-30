// In development, use relative path to leverage proxy
// In production, use full URL
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // Use relative path in development (will be proxied)
    return '/';
  }
  // Production: use environment variable or default
  return (process.env.REACT_APP_API_URL || "http://localhost:3003").replace(/\/?$/, "/");
};

export const serverApi = getApiUrl();

export const Messages = {
    error1: "Something went wrong!",
    error2:"Please login first!",
    error3: "Please fulfill all inputs!",
    error4: "Message is empty!",
    error5: "Only images with jpeg, jpg, png format allowed!",

}