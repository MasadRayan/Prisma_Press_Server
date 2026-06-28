import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

router.get("/", postController.getAllPost)

export const postRoute = router