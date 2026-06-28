import { prisma } from "../../lib/prisma";
import { ICreatePost, IUpdatePost } from "./post.interface";

const createPostIntoDb = async (userId: string, payload: ICreatePost) =>{
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })
    return result
}

const getAllPostFromDb = async () =>{
    const result = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        },
        orderBy: {
            createdAt : "desc"
        }
    })
    return result
}

const getPostByIdFromDB = async (postId : string) => {
    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views: {
                increment: 1
            }
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return updatedPost
}

const getMyPostFromDb = async (authorId : string) => {
    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        include : {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true,

            _count: {
                select: {
                    comments: true
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    })
    return result;
}

const updatePostIntoDb = async (authorId: string, postId: string, payload: IUpdatePost, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id : postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not authorized to update this post");
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include : {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true,

            _count: {
                select: {
                    comments: true
                }
            }
        },
    })

    return result
        
}

const deletePostFromDb = async (authorId: string, postId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not authorized to delete this post");
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })
}

export const postService = {
    createPostIntoDb,
    getAllPostFromDb,
    getPostByIdFromDB,
    getMyPostFromDb,
    updatePostIntoDb,
    deletePostFromDb
}