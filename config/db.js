import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI, {
      dbName: "YouTube-Clone"
    });
    console.log("Database connected successfully!")

  } catch (err) {
    console.log("Database connection failed!")
  }
};

export default connectDB;