import express from "express";
import { createChannelController, fetchChannelDetailsController, updateChannelController } from "../controllers/channelController.js";
import upload from "../config/multer.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-channel", verifyToken, upload.single("banner"), createChannelController);
router.patch("/update-channel", verifyToken, upload.single("banner"), updateChannelController);
router.get("/channel-details/:channelId", fetchChannelDetailsController);

export default router;