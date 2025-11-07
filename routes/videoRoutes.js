import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../config/multer.js";
import { addVideoController, deleteVideoController, fetchSingleVideoController, fetchVideosController, updateVideoController } from "../controllers/videoController.js";

const router = express.Router();

router.get("/videos", fetchVideosController);

router.post("/videos/upload-video", verifyToken, upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), addVideoController);

router.patch("/videos/update-video/:videoId", verifyToken, upload.single("thumbnail"), updateVideoController);

router.delete("/videos/delete-video/:videoId", verifyToken, deleteVideoController);

router.get("/videos/video/:videoId", fetchSingleVideoController);


export default router;