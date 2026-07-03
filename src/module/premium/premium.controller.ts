import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { premiumService } from "./premium.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllPremiumPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await premiumService.getAllPremiumPostFromDb()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Premium posts fetched successfully",
        data: result
    })
})


export const premiumController = {
    getAllPremiumPosts
}
