import { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { IPostQuery } from "../post/post.interface"

const getPremiumContent = async (query : IPostQuery) => {
    const limit = query?.limit ? Number(query.limit) : 10
        const page = query?.page ? Number(query.page) : 1
        const skip = (page -1) * limit
    
        const sortBy = query?.sortBy ? query.sortBy : "createdAt";
        const sortOrder = query?.sortOrder ? query.sortOrder : "desc"
    
        const tagsArray = query.tags ? JSON.parse(query.tags as string) : [];
    
        const andConditions : PostWhereInput[] = []
    
        if(query.searchTerm){
            andConditions.push({
                OR : [
                    {
                        title : {
                            contains : query.searchTerm,
                            mode : "insensitive"
                        }
                    },
                    {
                        content : {
                            contains : query.searchTerm,
                            mode : "insensitive"
                        }
                    }
                ]
            })
        }
    
        if(query.title){
            andConditions.push({
                title : query.title
            })
        }
    
        if(query.content){
            andConditions.push({
                content : query.content
            })
        }
        if(query.authorId){
            andConditions.push({
                content : query.authorId
            })
        }
        if(query.isFeatured){
            andConditions.push({
                isFeatured : Boolean(query.isFeatured)
            })
        }
    
    
        if(typeof query.tags === "string"){
            andConditions.push({
                tags : {
                    hasSome : tagsArray
                }
            })
        }
    
        if(query.status){
            andConditions.push({
                status : query.status
            })
        }

        andConditions.push({
            isPremium : true
        })

    const posts = await prisma.post.findMany({
        where : {
            AND : andConditions
        },
        take : limit,
        skip : skip,
        orderBy : {
            [sortBy] : sortOrder
        },
        include : {
            author : true,
            comment : true
        }
    })

    const totalPostCount = await prisma.post.count({
        where : {
            AND : andConditions
        }
    })

    return {
        data : posts,
        meta : {
            page : page,
            limit : limit,
            total : totalPostCount,
            totalPages : Math.ceil(totalPostCount / limit)
        }
    };
}

export const  premiumService = {
    getPremiumContent
}