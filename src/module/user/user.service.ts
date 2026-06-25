import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ICreateUser } from "./user.interface";

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


export const userService = {
    createUserIntoDb
}