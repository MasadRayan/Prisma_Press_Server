import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getAllPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
});


export const postController = {
    getAllPost
}