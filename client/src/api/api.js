import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API URL
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export useApi function
export const useApi = () => api;

export default api;
