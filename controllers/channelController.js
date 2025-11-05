import cloudinary from "../config/cloudinary.js";
import Channel from "../schema/channelSchema.js";
import { clientErorResponse, serverErrorResponse } from "../util/errorResponse.js";
import User from "../schema/userSchema.js";
import fs from "fs";
import Video from "../schema/videoSchema.js";
import { subscribe } from "diagnostics_channel";

// ------------------------------CREATE CHANNEL--------------------------------
export const createChannelController = async (req, res) => {
  try {
    const { channelName, description } = req.body;
    const owner = req.user?._id;

    //check for required fields
    if (!channelName) return clientErorResponse(res, 400, "Channel name required");

    //Check if user already has a channel
    const user = await User.findById(owner);
    if (user.channel)
      return clientErorResponse(res, 400, "User already has a channel");

    //check if channel name already exists
    const existingChannel = await Channel.findOne({ channelName });
    if (existingChannel) return clientErorResponse(res, 400, "Channel name already taken");

    //upload banner to cloudinary
    let bannerUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "youtube-clone/banners"
      });

      bannerUrl = result.secure_url;

      //Delete local files after successfull upload
      fs.unlinkSync(req.file.path);
    }

    //create channel
    const newChannel = await Channel.create({
      channelName,
      owner,
      description: description || undefined,
      banner: bannerUrl || undefined,
    })

    //Link the channel to the user
    await User.findByIdAndUpdate(owner, { $set: { channel: newChannel._id } });

    return res.status(201).json({
      success: true,
      message: "Channel created successfully!",
      channel: newChannel,
    })


  } catch (err) {
    return serverErrorResponse(err, res)
  }
};



// ------------------------------UPDATE CHANNEL--------------------------------
export const updateChannelController = async (req, res) => {
  try {
    const { channelName, description } = req.body;
    const ownerId = req.user?._id;

    //Ensure the user is authenticated
    if (!ownerId) return clientErorResponse(res, 401, "Unauthorized access!");

    //Find the user's channel
    const channel = await Channel.findOne({ owner: ownerId });
    if (!channel) return clientErorResponse(res, 404, "Channel not found!");

    //handle banner upload
    let bannerUrl = channel.banner;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "youtube-clone/banners",
      });
      bannerUrl = result.secure_url;

      //Delete local files after successfull upload
      fs.unlinkSync(req.file.path);

    }

    //update fields
    channel.channelName = channelName || channel.channelName;
    channel.description = description || channel.description;
    channel.banner = bannerUrl;

    //save changes
    const updatedChannel = await channel.save();

    return res.status(200).json({
      success: true,
      message: "Channel updated successfully",
      channel: updatedChannel,
    })

  } catch (err) {
    return serverErrorResponse(err, res);
  }
};



// ------------------------------FETCH CHANNEL VIDEOS--------------------------------
export const fetchChannelDetailsController = async (req, res) => {
  try {
    const { channelId } = req.params;

    //Validate channelId
    if (!channelId) return clientErorResponse(res, 400, "Channel ID is required!");

    //Check if the channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) return clientErorResponse(res, 404, "Channel not found!");

    //fetch videos
    const videos = await Video.find({ channelId })
      .populate("channelId", "channelName banner")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fetched channel details!",
      data: {
        _id: channel._id,
        channelName: channel.channelName,
        baner: channel.banner,
        description: channel.description,
        subscribers: channel.subscribers,
        videos: videos.length ? videos : [],
      }
    })


    //Ensure user
  } catch (err) {
    return serverErrorResponse(err, res);
  }
}