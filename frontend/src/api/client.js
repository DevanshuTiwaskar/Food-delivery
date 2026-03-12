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

export default api;
