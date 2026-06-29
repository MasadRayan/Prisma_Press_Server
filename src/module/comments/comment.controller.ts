import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;   
    const authorId = req.user?.id as string;
    const result = await commentService.createCommenntIntoDb(payload, authorId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Comment created successfully",
        data: result
    })
})

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId as string;
    const result = await commentService.getCommentByAuthorId(authorId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment fetched successfully",
        data: result
    })
});

const getCommentByPostId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string;
    const result = await commentService.getCommentByPostIdFromDB(postId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment fetched successfully",
        data: result
    })
})

const getCommentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const result = await commentService.getCommentByIdFromDB(commentId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment fetched successfully",
        data: result
    })
})

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentById,
    getCommentByPostId
}