import { Router } from "express";
import { premiumController } from "./premium.controller";

const router = Router();
router.get("/", premiumController.getAllPremiumPosts)

export const premiumRoute = router