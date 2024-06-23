import express from "express";
import AllRoutes from "./routes/index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.send("Working.");
});

app.use("/api/v1", AllRoutes);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("DB connected.");
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
