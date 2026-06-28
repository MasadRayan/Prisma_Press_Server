import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";

const router = Router();

router.post("/", auth(UserRole.ADMIN, UserRole.USER, UserRole.AUTHOR), postController.createPost)
router.get("/", postController.getAllPost)


export const postRoute = router