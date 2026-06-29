import { prisma } from "../../lib/prisma";
import { ICreateComment } from "./comment.interface";

const createCommenntIntoDb = async (payload: ICreateComment, authorId: string) => {
    const {postId} = payload;

     await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    const result = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    })

    return result
}

const getCommentByAuthorId = async (authorId : string) => {
    const result = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    role: true
                }
            },
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return result
}

const getCommentByIdFromDB = async (commentId : string) => {
    const result = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    role: true
                }
            },
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    return result
}

export const commentService = {
    createCommenntIntoDb,
    getCommentByAuthorId,
    getCommentByIdFromDB
}