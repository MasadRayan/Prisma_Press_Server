import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface ICreatePost {
    title : string
    content: string
    thumbnail ?: string
    isFeatured : boolean
    status: PostStatus
    tags : string[]
 }

 export interface IUpdatePost {
    title ?: string
    content ?: string
    thumbnail ?: string
    isFeatured ?: boolean
    status ?: PostStatus
    tags ?: string[]
 }

 export interface IGetAllPostQuery extends PostWhereInput {
  title?: string;
  content?: string;
  searchTerm?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}