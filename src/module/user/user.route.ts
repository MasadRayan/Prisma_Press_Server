import { Router } from "express";
import { userController } from "./user.controller";
const route  = Router();

route.post("/register", userController.registerUser);
route.get("/me", userController.getMyProfile);


export const userRoute = route