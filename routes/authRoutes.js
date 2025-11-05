import express from "express";
import { loginController, registrationController } from "../controllers/authController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registrationController);
router.post("/login", loginController);

export default router;