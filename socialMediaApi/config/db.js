import mongoose from "mongoose";
import { MONGODB_URI } from "./utils.js";
export default function connectDB() {
  try {
    mongoose
      .connect(MONGODB_URI)
      .then(() => {
        console.log(`Connected to MongoDB: ${MONGODB_URI}`);
      })
      .catch((error) => {
        console.log(error);
        console.log("Failed to connect to database.");
      });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  return;
}
