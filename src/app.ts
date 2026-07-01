import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import { userRoute } from "./module/user/user.route";
import { authRoute } from "./module/auth/auth.route";
import { postRoute } from "./module/posts/post.route";
import { commentRoute } from "./module/comments/comment.route";
import { routeNotFoundHandler } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { subscriptionRouter } from "./module/subscription/subscription.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send("Hello World!");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/subscription", subscriptionRouter)

app.use(routeNotFoundHandler);

app.use(globalErrorHandler);

export default app;