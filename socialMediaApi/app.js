import morgan from "morgan";
import express from "express";
import rateLimiit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

const app = express();

const limiter = rateLimiit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many request, please try again after an hour",
});

app.use(cors());

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

app.use(morgan("dev"));
app.use(limiter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

export default app;
