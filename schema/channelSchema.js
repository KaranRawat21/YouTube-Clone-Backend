import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: [true, "Channel name is required!"],
    unique: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  banner: {
    type: String,
    default: "https://t3.ftcdn.net/jpg/05/04/79/36/360_F_504793614_M1ceDHDwT1yX8oj7BhSjfyeNP0PmDu6l.jpg",
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video,"
    }
  ]
}, { timestamps: true });

const Channel = mongoose.model("Channel", ChannelSchema);

export default Channel;