import { Router } from "express";
import { userController } from "./user.controller";
import { UserRole } from "../../../generated/prisma/client";
const route = Router();
import { auth } from "../../middleware/auth";


route.post("/register", userController.registerUser);
route.get("/me",auth(UserRole.USER, UserRole.ADMIN, UserRole.AUTHOR),userController.getMyProfile,);
route.get("/all-user", auth(UserRole.ADMIN), userController.getAllUser);
route.put("/my-profile", auth(UserRole.USER, UserRole.ADMIN, UserRole.AUTHOR), userController.updateMyProfile);

export const userRoute = route;
