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
    const query = req.query
    const allPosts = await postService.getAllPostFromDb(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All posts fetched successfully",
        data: allPosts
    })
});

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
        throw new Error ("Post id is required");
    }
    const post  = await postService.getPostByIdFromDB(postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post fetched successfully",
        data: post
    })

})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const post = await postService.getMyPostFromDb(authorId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My posts fetched successfully",
        data: post
    })
})

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const postId = req.params.postId as string
    if (!postId) {
        throw new Error ("Post id is required");
    }

    const payload = req.body;
    const isAdmin = req.user?.role === "ADMIN";

    const result = await postService.updatePostIntoDb(authorId, postId, payload, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post updated successfully",
        data: result
    })
})

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const postId = req.params.postId as string
    if (!postId) {
        throw new Error ("Post id is required");
    }

    const isAdmin = req.user?.role === "ADMIN";

    await postService.deletePostFromDb(authorId, postId, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully",
        data: null
    })
})

const getStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getStateFromDb();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Stats fetched successfully",
        data: result
    })
})

export const postController = {
    getAllPost,
    createPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats
}