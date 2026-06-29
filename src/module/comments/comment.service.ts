import { prisma } from "../../lib/prisma";
import { ICreateComment } from "./comment.interface";

const createCommenntIntoDb = async (payload: ICreateComment, authorId: string) => {
    const {postId} = payload;

    const isPostExists = await prisma.post.findUniqueOrThrow({
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

export const commentService = {
    createCommenntIntoDb
}