import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/client";

const router = Router();

router.post("/", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER) ,commentController.createComment)
router.get("/author/:authorId", commentController.getCommentByAuthorId)

export const commentRoute = router;