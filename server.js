import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "API is working..."
  });
});

//authRoutes
app.use("/api/auth", authRoutes);

//channelRoutes
app.use("/api", channelRoutes);

//videoRoutes
app.use("/api", videoRoutes);

//commentRoutes
app.use("/api", commentRoutes);

// -------------Unknow Routes--------------
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found!",
  });
});

const PORT = process.env.PORT || 5000;
connectDB()

app.listen(PORT, () => {
  console.log("Server started...")
})
