import express from "express";
import { createChannelController, updateChannelController } from "../controllers/channelController.js";
import upload from "../config/multer.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/createchannel", verifyToken, upload.single("banner"), createChannelController);
router.patch("/updateChannel", verifyToken, upload.single("banner"), updateChannelController);

export default router;