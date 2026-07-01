import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/checkout", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER), subscriptionController.createCheckOutSession);

export const subscriptionRouter = router