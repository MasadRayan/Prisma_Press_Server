import { prisma } from "../../lib/prisma";

const getAllPremiumPostFromDb = async () => {
    const result = await prisma.post.findMany({
        where: {
            isPremium: true
        }
    })
    return result;
}

export const premiumService = {
    getAllPremiumPostFromDb
}