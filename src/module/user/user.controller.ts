import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const userResponse = await userService.createUserIntoDb(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error: any) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const userController = {
  registerUser,
};
