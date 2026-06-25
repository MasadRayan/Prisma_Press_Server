import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwtUtils";
import config from "../../config";
import { UserRole } from "../../../generated/prisma/client";
import { sendResponse } from "../../utils/sendResponse";
const route = Router();
import httpStatus from "http-status";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
            };
        }
    }
}

route.post("/register", userController.registerUser);
route.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    // console.log(accessToken)

    const verifyToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );
    console.log(verifyToken);

    if (typeof verifyToken === "string") {
      throw new Error(verifyToken);
    }
    const {id, name, email, role} = verifyToken

    const userRoles = [UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER]

    if (!userRoles.includes(role)) {
        sendResponse(res, {
            success: false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: "You are not authorized to access this route",
            data: null
        })
    }

    req.user = {
        id,
        name,
        email,
        role
    }

    next();
  },
  userController.getMyProfile,
);

export const userRoute = route;
