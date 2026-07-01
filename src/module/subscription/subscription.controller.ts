import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { enableCompileCache } from "module";

const createCheckOutSession = catchAsync(async (req: Request, res:Response, next: NextFunction) => {

})

export const subscriptionController = {
    createCheckOutSession
}