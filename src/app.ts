import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";

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

app.post("/users/register", async (req : Request, res : Response) => {
    const body = req.body;
    const {name, email, password, profilePhoto} = body;
    

    const isUserExists =await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isUserExists) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "User already exists"
        })
    };

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })

    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto: profilePhoto
        }
    })

    const userResponse = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email : createdUser.email || email
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })

    res.status(httpStatus.CREATED).json({
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: userResponse
    })
})

export default app;