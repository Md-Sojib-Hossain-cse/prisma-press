import { prisma } from "../../lib/prisma"
import { TCreatePostPayload } from "./post.interface"

const getAllPostsFromDB = async() => {}

const getSpecificPostFromDB = async() => {}

const getMyPostsFromDB = async() => {}

const getPostStatsFromDB = async() => {}

const createPostOnDB = async(userId : string ,payload : TCreatePostPayload) => {
    const result = await prisma.post.create({
        data : {
            ...payload,
            authorId : userId
        }
    })

    return result;
}

const updatePostOnDB = async() => {}

const deletePostFromDB = async() => {}



export const postService = {
    getAllPostsFromDB,
    getSpecificPostFromDB,
    getMyPostsFromDB,
    getPostStatsFromDB,
    createPostOnDB,
    updatePostOnDB,
    deletePostFromDB
}