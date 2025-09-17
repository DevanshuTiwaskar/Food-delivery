import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.MOGODB_URL)
    .then(() => console.log("DB Connected"))
    .catch((error)=>console.log("error in DB connect",error))
};

