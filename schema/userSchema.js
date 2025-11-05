import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required!"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required!"],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address!"]
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;