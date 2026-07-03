import { Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { premiumGuard } from "../../middleware/premiumGuard";

const router = Router();
router.get("/", auth(UserRole.ADMIN, UserRole.AUTHOR, UserRole.USER), premiumGuard(), premiumController.getAllPremiumPosts)

export const premiumRoute = router