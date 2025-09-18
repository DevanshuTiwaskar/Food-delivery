// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://food-delivery-s3fj.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
