import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IGetAllPostQuery } from "../posts/post.interface";

const getAllPremiumPostFromDb = async (query: IGetAllPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const tags = query.tags ? JSON.parse(query.tags as string) : undefined;
  const tagArray = Array.isArray(tags) ? tags : [];

  const andConditions: PostWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }

  if (query.content) {
    andConditions.push({
      content: query.content,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId,
    });
  }

  if (query.tags) {
    andConditions.push({
      tags: {
        hasSome: tagArray,
      },
    });
  }

  andConditions.push({
    isPremium: true,
  });

  const result = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  const totalPost = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: result,
    meta: {
      page,
      limit,
      total: totalPost,
      totalPage: Math.ceil(totalPost / limit),
    },
  };
};

export const premiumService = {
  getAllPremiumPostFromDb,
};
