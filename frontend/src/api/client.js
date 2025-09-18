import axios from "axios";

const api = axicomos.create({
  baseURL: "https://food-delivery-s3fj.onrender.",
//   baseURL: "https://ecomm-auth-user-and-seller.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
