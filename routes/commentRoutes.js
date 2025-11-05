import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { addCommentController, fetchCommentsController } from "../controllers/commentController.js";

const router = express.Router();

router.post("/comments/create-comment", verifyToken, addCommentController);

router.get("/:videoId/comments", fetchCommentsController);


export default router;