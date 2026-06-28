import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";

const router = Router();

router.post("/", auth(UserRole.ADMIN, UserRole.USER, UserRole.AUTHOR), postController.createPost)
router.get("/", postController.getAllPost);
router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER, UserRole.AUTHOR), postController.getMyPosts);
router.get("/stats", auth(UserRole.ADMIN), postController.getStats);
router.get("/:postId", postController.getPostById);
router.patch("/:postId", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER), postController.updatePost);
router.delete("/:postId", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER), postController.deletePost);


export const postRoute = router