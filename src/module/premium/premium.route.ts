import { Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();
router.get("/", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER), premiumController.getAllPremiumPosts)

export const premiumRoute = router