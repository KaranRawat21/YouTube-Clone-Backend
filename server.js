import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRouter.js"

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
