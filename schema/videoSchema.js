import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Video title is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  thumbnailUrl: {
    type: String,
    required: [true, "Thumbnail URL is required"],
    default: "https://www.elegantthemes.com/blog/wp-content/uploads/2019/04/change-wordpress-thumbnail-size-featured-image.jpg",
  },
  videoUrl: {
    type: String,
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commet",
    }
  ],
}, { timestamps: true });

const Video = mongoose.model("Video", VideoSchema);
export default Video;