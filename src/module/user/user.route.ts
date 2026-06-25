import { Router } from "express";
import { userController } from "./user.controller";
import { UserRole } from "../../../generated/prisma/client";
const route = Router();
import { auth } from "../../middleware/auth";


route.post("/register", userController.registerUser);
route.get(
  "/me",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.AUTHOR),
  userController.getMyProfile,
);

export const userRoute = route;
