import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,       // CDN URL
  imageFileId: String, // ImageKit fileId for deletion
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
