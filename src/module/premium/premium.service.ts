import { prisma } from "../../lib/prisma";

const getAllPremiumPostFromDb = async (userId : string) => {
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