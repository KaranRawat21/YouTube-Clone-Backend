import cloudinary from "../config/cloudinary.js";
import Channel from "../schema/channelSchema.js";
import Video from "../schema/videoSchema.js";
import { clientErorResponse, serverErrorResponse } from "../util/errorResponse.js"
import fs from "fs";

// ------------------------------ADD VIDEO--------------------------------
export const addVideoController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ownerId = req.user?._id;
    const channel = await Channel.findOne({ owner: ownerId });

    if (!channel) return clientErorResponse(res, 404, "Channel not found!");
    if (!title) return clientErorResponse(res, 400, "Video title is required!");
    if (!req.files?.video || !req.files?.thumbnail) return clientErorResponse(res, 400, "Video and thumbnail are required!");

    //Upload thumbnail and video to cloudinary
    const thumbnailResult = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
      folder: "youtube-clone/thumbnails",
    });
    const videoResult = await cloudinary.uploader.upload(req.files.video[0].path, {
      folder: "youtube-clone/videos",
      resource_type: "video",
    });

    //Delete local files after successfull upload
    fs.unlinkSync(req.files.thumbnail[0].path);
    fs.unlinkSync(req.files.video[0].path);

    //create new video
    const newVideo = await Video.create({
      title,
      description,
      thumbnailUrl: thumbnailResult.secure_url,
      channelId: channel._id,
      videoUrl: videoResult.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Video upload successfully!",
      video: newVideo,
    });
  } catch (err) {
    return serverErrorResponse(err, res);
  }
};

// ------------------------------FETCH VIDEOS--------------------------------
export const fetchVideosController = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channelId", "channelName banner subscribers")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fetched videos!",
      videos,
    });
  } catch (err) {
    return serverErrorResponse(err, res);
  }
};


// ------------------------------FETCH SINGLE VIDEO--------------------------------
export const fetchSingleVideoController = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId.toString()) return clientErorResponse(res, 400, "Video ID is required!");
    const video = await Video.findOne({ _id: videoId.toString() });
    if (!video) return clientErorResponse(res, 404, "Requested video not found!");

    const fullInfo = await video.populate("channelId", "channelName banner")
    return res.status(200).json({
      success: true,
      message: "Fetched video information successfully!",
      video: fullInfo,
    })

  } catch (err) {
    return serverErrorResponse(err, res);
  }
}


// ------------------------------UPDATE VIDEO--------------------------------
export const updateVideoController = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const ownerId = req.user?._id;

    const video = await Video.findById(videoId).populate("channelId");

    if (!video) return clientErorResponse(res, 404, "Video not found!");
    if (video.channelId.owner.toString() !== ownerId) return clientErorResponse(res, 403, "Unauthorized to update this video");

    //thumbnail update
    let thumbnailUrl = video.thumbnailUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "youtube-clone/thumbnails",
      });
      thumbnailUrl = result.secure_url;

      //Delete local files after successfull upload
      fs.unlinkSync(req.files.thumbnail[0].path);
    }

    //update values
    video.title = title || video.title;
    video.description = description || video.description;
    video.thumbnailUrl = thumbnailUrl;

    const updatedVideo = await video.save();

    return res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (err) {
    return serverErrorResponse(err, res);
  }
};



// ------------------------------DELETE VIDEO--------------------------------
export const deleteVideoController = async (req, res) => {
  try {
    const { videoId } = req.params;
    const ownerId = req.user?._id;

    const video = await Video.findById(videoId).populate("channelId");
    if (!video) return clientErorResponse(res, 404, "Video not found!");
    if (video.channelId.owner.toString() !== ownerId) return clientErorResponse(res, 403, "Unauthorized to delete this video");

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully!",
      data: null,
    })
  } catch (err) {
    return serverErrorResponse(err, res);
  }
}