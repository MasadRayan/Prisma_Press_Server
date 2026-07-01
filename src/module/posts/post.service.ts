import { promiseHooks } from "node:v8";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePost, IUpdatePost } from "./post.interface";
import { PostWhereInput } from "../../../generated/prisma/models";

const createPostIntoDb = async (userId: string, payload: ICreatePost) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

interface IGetAllPostQuery extends PostWhereInput {
  title ?: string
  content ?: string
  searchTerm ?: string
  limit ?: string
  page ?: string
  sortBy ?: string
  sortOrder ?: string
}


const getAllPostFromDb = async (query: IGetAllPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page  = query.page ? Number(query.page) : 1
  const skip = (page - 1) * limit
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder  = query.sortOrder ? query.sortOrder : "desc"
  const result = await prisma.post.findMany({
    
    where: {
      AND: [
        query.searchTerm ? {
          OR: [
            {
              title: {
                contains: query.searchTerm ,
                mode: "insensitive"
              }
            },
            {
              content : {
                contains: query.searchTerm,
                mode: "insensitive"
              }
  
            }
          ]
        } : 
        {},

        query.title ? { title: query.title} : {},
        query.content ? { content : query.content} : {}
      ]
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy] : sortOrder
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    }
  });
  return result;
};

const getPostByIdFromDB = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const result = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return result;
  });

  return transactionResult;
};

const getMyPostFromDb = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,

      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updatePostIntoDb = async (
  authorId: string,
  postId: string,
  payload: IUpdatePost,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

const deletePostFromDb = async (
  authorId: string,
  postId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to delete this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getStateFromDb = async () => {
  const AllStateTransaction = await prisma.$transaction(async (tx) => {
    //Bad Approch*************
    // const totalPost = await tx.post.count();
    // const totalPublishedPost = await tx.post.count({
    //     where: {
    //         status: PostStatus.PUBLISHED
    //     }
    // })
    // const totalArchivedPost = await tx.post.count({
    //     where: {
    //         status: PostStatus.ARCHIVED
    //     }
    // })
    // const totalDraftPost = await tx.post.count({
    //     where: {
    //         status: PostStatus.DRAFT
    //     }
    // })
    // const totalComment = await tx.comment.count();
    // const totalApprovedComment = await tx.comment.count({
    //     where: {
    //         status: CommentStatus.APPROVED
    //     }
    // })
    // const totalRejectedComment = await tx.comment.count({
    //     where: {
    //         status : CommentStatus.REJECTED
    //     }
    // })
    // const totalUser = await tx.user.count();
    // const AggrigatedViewsCount = await tx.post.aggregate({
    //     _sum : {
    //         views: true
    //     }
    // })
    // const totalViews = AggrigatedViewsCount._sum.views;

    // return {
    // totalPost,
    // totalPublishedPost,
    // totalArchivedPost,
    // totalDraftPost,
    // totalComment,
    // totalApprovedComment,
    // totalRejectedComment,
    // totalUser,
    // totalViews
    // }

    //Best Approch
    const [
      totalPost,
      totalPublishedPost,
      totalArchivedPost,
      totalDraftPost,
      totalComment,
      totalApprovedComment,
      totalRejectedComment,
      totalUser,
      totalAggrigatedViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.user.count(),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPost,
      totalPublishedPost,
      totalArchivedPost,
      totalDraftPost,
      totalComment,
      totalApprovedComment,
      totalRejectedComment,
      totalUser,
      totalViews: totalAggrigatedViews._sum.views,
    };
  });
  return AllStateTransaction;
};

export const postService = {
  createPostIntoDb,
  getAllPostFromDb,
  getPostByIdFromDB,
  getMyPostFromDb,
  updatePostIntoDb,
  deletePostFromDb,
  getStateFromDb,
};
