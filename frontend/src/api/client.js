// src/api/client.js
import axios from "axios";

const API_URL = import.meta.env.DEV 
  ? "http://localhost:4000" 
  : "https://food-delivery-1-8uo5.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user data
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("adminToken");
      
      // Optionally reload or redirect
      // window.location.href = "/";
      
      // We can use a custom event to notify components if needed
      window.dispatchEvent(new Event("session-expired"));
    }
    return Promise.reject(error);
  }
);

export default api;
