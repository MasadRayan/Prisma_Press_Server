import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const createUserResponse = await authService.loginUser(payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User logged in successfully",
        data: createUserResponse
    })
})


export const authController = {
    loginUser
}