import { prisma } from "../../lib/prisma"
import { ICreateComment } from "./comment.interface"

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

const getSingleCommentFromDB = async()=> {}

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

const updateCommentOnDB = async()=> {}

const deleteCommentFromDB = async()=> {}

const changeCommentModStatsOnDB = async()=> {}


export const commentService = {
    getSpecificAuthorCommentsFromDB,
    getSingleCommentFromDB,
    createCommentOnDB,
    updateCommentOnDB,
    deleteCommentFromDB,
    changeCommentModStatsOnDB
}