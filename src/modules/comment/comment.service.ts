import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreateComment, IUpdateComment } from "./comment.interface"

const getSpecificAuthorCommentsFromDB = async(authorId : string) => {
    const result = await prisma.comment.findMany({
         where : {
            authorId
         },
         orderBy : {
            createdAt : "desc"
         },
         include : {
            post : {
                select : {
                    id : true,
                    title : true,
                    views : true
                }
            }
         }
    })

    return result;
}

const getSingleCommentFromDB = async(commentId : string)=> {
    const result = await prisma.comment.findUnique({
        where : {
            id : commentId
        },
        include : {
            post : {
                select : {
                    id : true,
                    title : true,
                    views : true
                }
            }
         }
    })


    return result;
}

const createCommentOnDB = async(authorId : string , payload : ICreateComment)=> {
    const result = await prisma.comment.create({
        data : {
            authorId,
            ...payload
        },
        include : {
            author : {
                omit : {
                    password : true
                }
            },
            post : true
        }
    })

    return result;
}

const updateCommentOnDB = async(userId : string, commentId : string , payload : IUpdateComment)=> {
    const result = await prisma.comment.findUnique({
        where : {
            id : commentId
        }
    })

    console.log(result)

    return null;
}

const deleteCommentFromDB = async()=> {}

const changeCommentModStatsOnDB = async(commentId : string , status : CommentStatus)=> {
    const result = await prisma.comment.update({
        where : {
            id : commentId
        },
        data : {
            status
        },
        include : {
            author : {
                omit : {
                    password : true
                }
            },
            post : {
                select : {
                    id : true,
                    title : true,
                    views : true
                }
            }
        }
    })

    return result;
}


export const commentService = {
    getSpecificAuthorCommentsFromDB,
    getSingleCommentFromDB,
    createCommentOnDB,
    updateCommentOnDB,
    deleteCommentFromDB,
    changeCommentModStatsOnDB
}