export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    profilePhoto?: string
}

export interface IUpdateUser {
    name: string;
    bio?: string;
    profilePhoto?: string
}