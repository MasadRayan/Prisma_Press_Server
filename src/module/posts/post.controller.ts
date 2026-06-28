import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await postService.createPostIntoDb(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post created successfully",
        data: result
    })
})

const getAllPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const allPosts = await postService.getAllPostFromDb();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All posts fetched successfully",
        data: allPosts
    })
});


export const postController = {
    getAllPost,
    createPost
}