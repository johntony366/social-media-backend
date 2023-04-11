import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";
import { initDB } from "./db/initDB";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";

const app = express();
dotenv.config();

app.use(
  cors({
    allowedHeaders: "*, auth",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDB();

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server is running on port ${process.env.PORT}`);
});
