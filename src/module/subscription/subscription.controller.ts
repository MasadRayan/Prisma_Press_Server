import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { enableCompileCache } from "module";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckOutSession = catchAsync(async (req: Request, res:Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await subscriptionService.createCheckOutSession(userId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout session created successfully",
        data: result
    })
})

const webhookController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await subscriptionService.webhookService(payload, signature as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout session created successfully",
        data: null
    })
})

export const subscriptionController = {
    createCheckOutSession,
    webhookController
}