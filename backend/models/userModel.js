// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // don't return by default
    },
    fullName: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
    },
    cartData: {
      type: Object,
      default: {},
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"], // 👈 added seller to match controller
      default: "user",
    },
  },
  { minimize: false, timestamps: true }
);

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
