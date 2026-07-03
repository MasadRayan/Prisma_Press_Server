import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

export const premiumGuard = () => {
  return catchAsync(async (req: any, res: any, next: any) => {
    const userId = req.user?.id as string;
    const isPremiumExists = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!isPremiumExists) {
      throw new Error("Please Subscribe to access the premium posts");
    }

    if (isPremiumExists.status !== "ACTIVE") {
      throw new Error(
        "Please renew your subscription to access the premium posts",
      );
    }
    next()
  });
};
