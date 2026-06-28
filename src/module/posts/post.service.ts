import { prisma } from "../../lib/prisma";
import { ICreatePost } from "./post.interface";

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


export const postService = {
    createPostIntoDb,
    getAllPostFromDb
}