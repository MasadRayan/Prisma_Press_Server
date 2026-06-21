import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { userRoute } from "./module/user/user.route";

const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", async(req, res) => {
    const users = await prisma.user.findMany();
    console.log(users)
    res.send("Hello World!");
});

app.use("/api/users", userRoute)

export default app;