import Comment from "../schema/commentSchema.js";
import Video from "../schema/videoSchema.js";
import { clientErorResponse, serverErrorResponse } from "../util/errorResponse.js";


// ------------------------------ADD COMMENT--------------------------------
export const addCommentController = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const userId = req.user?._id;

    if (!userId) return clientErorResponse(res, 401, "Required login to make comments!");

    if (!videoId || !text) return clientErorResponse(res, 400, "Video ID and comment text are required!");

    const video = await Video.findById(videoId);
    if (!video) return clientErorResponse(res, 404, "Video not found!");

    const comment = await Comment.create({
      videoId,
      userId,
      text,
    });

    const newComment = await comment.populate("userId", "username avatar");

    //adding comment id reference to video document
    video.comments.push(comment._id);
    await video.save();


    //response
    return res.status(201).json({
      success: true,
      message: "Comment added successfully!",
      data: newComment
    })


  } catch (err) {
    return serverErrorResponse(err, res)
  }
};



// ------------------------------FETCH COMMENTS BY VIDEO--------------------------------
export const fetchCommentsController = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ videoId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fetched comments",
      data: {
        comments,
        length: comments.length,
      }
    })

  } catch (err) {
    return serverErrorResponse(err, res);
  }
}