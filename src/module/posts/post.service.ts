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

const getPostByIdFromDB = async (postId : string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
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


export const postService = {
    createPostIntoDb,
    getAllPostFromDb,
    getPostByIdFromDB
}