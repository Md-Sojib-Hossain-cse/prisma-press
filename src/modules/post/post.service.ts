import { prisma } from "../../lib/prisma"
import { IUpdatePostPayload, TCreatePostPayload } from "./post.interface"

const getAllPostsFromDB = async() => {
    const result = await prisma.post.findMany({
        include : {
            author : true,
            comment : true
        }

    })

    return result;
}

const getSpecificPostFromDB = async(postId : string) => {
    await prisma.post.findUniqueOrThrow({
        where : {
            id : postId
        }
    })

    const updatedPost = await prisma.post.update({
        where : {
            id : postId
        },
        data : {
            views : {
                increment : 1
            }
        },
        include : {
            author : {
                omit : {
                    password : true
                }
            },
            comment : true
        }
    })

    return updatedPost
}

const getMyPostsFromDB = async(authorId : string) => {
    const result = await prisma.post.findMany({
        where : {
            authorId : authorId
        },
        orderBy : {
            createdAt : "desc"
        },
        include : {
            comment : true,
            author : {
                omit : {
                    password : true
                }
            },
            _count : {
                select : {
                    comment : true
                }
            }
        }
    })

    return result;
}

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

const updatePostOnDB = async(postId : string, payload : IUpdatePostPayload , userId : string , isAdmin : boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where : {
            id : postId
        }
    })

    if(!isAdmin && post.authorId !== userId){
        throw new Error("You do not have permission to update this post.")
    }

    const result = await prisma.post.update({
        where : {
            id : postId
        },
        data : payload,
        include : {
            author : {
                omit : {
                    password : true
                }
            },
            comment : true
        }
    })

    return result
}

const deletePostFromDB = async(postId : string , userId : string , isAdmin : boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where : {
            id : postId
        }
    })

    if(!isAdmin && post.authorId !== userId){
        throw new Error("You do not have permission to update this post.")
    }

    const result = await prisma.post.delete({
        where : {
            id : postId
        }
    })

    return result;
}



export const postService = {
    getAllPostsFromDB,
    getSpecificPostFromDB,
    getMyPostsFromDB,
    getPostStatsFromDB,
    createPostOnDB,
    updatePostOnDB,
    deletePostFromDB
}