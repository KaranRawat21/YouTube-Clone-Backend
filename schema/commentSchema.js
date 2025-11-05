import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
  },
  commentedOn: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Comment = mongoose.model("Commment", CommentSchema);

export default Comment;