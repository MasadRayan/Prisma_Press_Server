import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ICreateUser, IUpdateUser } from "./user.interface";

const createUserIntoDb = async (payload: ICreateUser) => {
    const {name, email, password, profilePhoto} = payload;
    const isUserExists =await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isUserExists) {
        throw new Error("User already exists with this email");
    };

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            profile: {
                create: {
                    profilePhoto
                }
            }
        }
    })

    const userResponse = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email : createdUser.email || email
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })

    return userResponse
}

const getMyProfileFromDb = async (userId : string) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit : {
            password: true
        },
        include: {
            profile: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user

}

const getAllUserFromDB = async () => {
    const result = await prisma.user.findMany({
        include: {
            profile: true,
            posts: {
                select: {
                    title: true,
                    id: true,
                    views: true
                },
            },
            comments: {
                select: {
                    content: true,
                    status: true
                }
            },
            _count: {
                select: {
                    posts: true,
                    comments: true
                }
            }
        }
    })
    return result
}

const updateMyProfileInDB = async (userId : string, payload: IUpdateUser) => {
    const {name, profilePhoto, bio} = payload;

    const updateUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            profile: {
                update: {
                    profilePhoto,
                    bio
                }
            }
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })
    return updateUser
}


export const userService = {
    createUserIntoDb,
    getMyProfileFromDb,
    updateMyProfileInDB,
    getAllUserFromDB
}