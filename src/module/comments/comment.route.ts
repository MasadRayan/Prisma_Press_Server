import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";

const router = Router();

router.post("/", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER) ,commentController.createComment)
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.get("/post/:postId", commentController.getCommentByPostId);
router.get("/:commentId", commentController.getCommentById);
router.patch("/:commentId/moderate", auth(UserRole.ADMIN), commentController.moderateComment);
router.patch("/:commentId", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER), commentController.updateComment);
router.delete("/:commentId", auth(UserRole.ADMIN, UserRole.USER), commentController.deletePost)

export const commentRoute = router;