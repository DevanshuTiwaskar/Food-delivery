import logo from './logo.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import profile_image from './profile_image.png'
import upload_area from './upload_area.png'
import parcel_icon from './parcel_icon.png'





export const assets ={
    logo,
    add_icon,
    order_icon,
    profile_image,
    upload_area,
    parcel_icon
}

// export const url = 'https://food-delivery-s3fj.onrender.com'
import axios from "axios";

// Change baseURL depending on environment
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000" // local backend
    : "https://food-delivery-s3fj.onrender.com"; // deployed backend

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

