import { prisma } from "../../lib/prisma";
import { ICreateComment, IUpdateComment } from "./comment.interface";

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

const getCommentByPostIdFromDB = async (postId : string) => {
    const result = await prisma.comment.findMany({
        where: {
            postId
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

const updateCommentInDB = async (commentId: string, payload: IUpdateComment, authorId: string) => {
    const commentExists = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    })

    if (commentExists.authorId !== authorId) {
        throw new Error("You are not authorized to update this comment")
    }

    const result = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: payload,
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

const deleteCommentFromDB = async (commentId: string, authorId: string, isAdmin: boolean) => {
    const comment = await prisma.comment.findUnique({
        where: {
            id : commentId
        }
    });

    if (!comment) {
        throw new Error("Comment not found")
    }

    if (!isAdmin && comment.authorId !== authorId) {
        throw new Error("You are not authorized to delete this comment")
    }

    await prisma.comment.delete({
        where: {
            id: commentId
        }
    })

}

export const commentService = {
    createCommenntIntoDb,
    getCommentByAuthorId,
    getCommentByIdFromDB,
    getCommentByPostIdFromDB,
    updateCommentInDB,
    deleteCommentFromDB
}