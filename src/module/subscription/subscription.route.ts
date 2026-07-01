import { Router } from "express";
import { subscriptionController } from "./subscription.controller";

const router = Router();

router.post("/checkout", subscriptionController.createCheckOutSession);

export const subscriptionRouter = router