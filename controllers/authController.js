import cloudinary from "../config/cloudinary.js";
import User from "../schema/userSchema.js";
import { clientErorResponse, serverErrorResponse } from "../util/errorResponse.js";
import bcrypt from "bcrypt";
import fs from "fs";
import { generateToken } from "../util/jwtToken.js";
import { channel } from "diagnostics_channel";


// -----------------------Registration Controller----------------------
export const registrationController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check for missing credentials
    if (!username || !email || !password) return clientErorResponse(res, 400, "All credentials required!");

    //check email and username already exist
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return clientErorResponse(res, 400, "User already exist!");

    //password validation
    if (password.length < 10) return clientErorResponse(res, 400, "Password length should not be less than 10!");

    //if everything okay
    const hashPassword = await bcrypt.hash(password, 10);

    //upload avatar to cloudinary
    let avatarUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "youtube-clone/avatars",
        resource_type: "image",
      });

      avatarUrl = result.secure_url;

      //delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    //create and save user
    await User.create({
      username,
      email,
      password: hashPassword,
      avatar: avatarUrl || undefined,
    })

    return res.status(201).json({
      success: true,
      message: "User registration successful!",
      data: {
        username,
        email,
        avatar: avatarUrl,
      }
    })

  } catch (err) {
    return serverErrorResponse(err, res)
  }
};


// -----------------------Login Controller----------------------
export const loginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check for missing credentials
    if ((!email && !username) || !password) return clientErorResponse(res, 400, "All fields required!");

    //invalid user 
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (!user) return clientErorResponse(res, 401, "User not found!");

    //compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) return clientErorResponse(res, 401, "Invalid password!");

    //if everything okay
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        token,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channel: user.channel
      }
    })


  } catch (err) {
    return serverErrorResponse(err, res);
  }
}
