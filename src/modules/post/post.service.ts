import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IUpdatePostPayload, TCreatePostPayload } from "./post.interface"

const getAllPostsFromDB = async() => {
    const result = await prisma.post.findMany({

        //exact match without AND operator
        // where : {
        //     title : "My Fourth Post",
        //     content : "Ronaldo"
        // },

        //exact match with AND operator
        // where : {
        //     AND : [
        //         {title : "My Fourth Post"},
        //         {content : "Ronaldo"},
        //         {
        //             tags : {
        //                 // equals : ["typescript","prisma","express"],
        //                 has : "typescript"
        //             }
        //         }
        //     ]
        // },

        //searching or partial match
        // where : {
        //     title :{
        //         contains : "ronaldo",
        //         mode : "insensitive"
        //     },
        //     // not ideal for partial match
        //     // content : {
        //     //     contains : "ronaldo",
        //     //     mode : "insensitive"
        //     // }
        // },


        //searching or partial search using OR operator
        // where  :{
        //     OR : [
        //         {
        //             title : {
        //                 contains : "Ronaldo",
        //                 mode : "insensitive"
        //         }
        //     },
        //     {
        //         content : {
        //             contains : "Ronaldo",
        //             mode : "insensitive"
        //         }
        //     }
        //     ]
        // },


        //combining search (OR) and filtering (AND)

        where : {
            AND : [
                //searching
                {
                    OR : [
                        {
                            title : {
                                contains : "Ron",
                                mode : "insensitive"
                            }
                        },
                        {
                            content : {
                                contains : "Ron",
                                mode : "insensitive"
                            }
                        }
                    ]
                },
                //filtering
                {
                    title : "Ronaldo"
                },
                {
                    content : "Ronaldo"
                }
            ]
        },
        include : {
            author : true,
            comment : true
        }

    })

    return result;
}

const getSpecificPostFromDB = async(postId : string) => {
    // await prisma.post.update({
    //     where : {
    //         id : postId
    //     },
    //     data : {
    //         views : {
    //             increment : 1
    //         }
    //     }
    // })

    // const post =  await prisma.post.findUniqueOrThrow({
    //     where : {
    //         id : postId
    //     },
    //     include : {
    //         author : {
    //             omit : {
    //                 password : true
    //             }
    //         },
    //         comment : {
    //             where : {
    //                 status : CommentStatus.APPROVED
    //             },
    //             orderBy : {
    //                 createdAt : "desc"
    //             }
    //         },
    //         _count : {
    //             select : {
    //                 comment : true
    //             }
    //         }
    //     }
    // })

    const transactionResult = await prisma.$transaction(
        async(tx) => {
            await tx.post.update({
                where : {
                    id : postId
                },
                data : {
                    views : {
                        increment : 1
                    }
                }
            })

            const post =await tx.post.findUniqueOrThrow({
                where : {
                    id : postId
                },
                include : {
                    author : {
                        omit : {
                            password : true
                        }
                    },
                    comment : {
                        where : {
                            status : CommentStatus.APPROVED
                        },
                        orderBy : {
                            createdAt : "desc"
                        }
                    },
                    _count : {
                        select : {
                            comment : true
                        }
                    }
                    
                }
            })
            return post
        }
        
        
    )
    return transactionResult
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

const getPostStatsFromDB = async() => {
    const transactionResult = await prisma.$transaction(
        // async(px) => {
        //     const totalPosts = await px.post.count()
        //     const totalPublishedPosts = await px.post.count({
        //         where : {
        //             status : PostStatus.PUBLISHED
        //         }
        //     })
        //     const totalDraftPosts = await px.post.count({
        //         where : {
        //             status : PostStatus.DRAFT
        //         }
        //     })
        //     const totalArchivedPosts = await px.post.count({
        //         where : {
        //             status : PostStatus.ARCHIVED
        //         }
        //     })

        //     const totalComments = await px.comment.count()

        //     const totalApprovedComments = await px.comment.count({
        //         where : {
        //             status : CommentStatus.APPROVED
        //         }
        //     })
        //     const totalRejectedComments = await px.comment.count({
        //         where : {
        //             status : CommentStatus.REJECT
        //         }
        //     })


        //     //Not a good approach
        //     // const allPosts = await px.post.findMany()

        //     // let totalPostViews = 0

        //     // allPosts.forEach(post => {
        //     //     totalPostViews = totalPostViews + post.views
        //     // })


        //     const totalPostViewsAggregate = await px.post.aggregate({
        //         _sum : {
        //             views : true
        //         }
        //     })

        //     const totalPostViews = totalPostViewsAggregate._sum.views


        //     return {
        //         totalPosts,
        //         totalPublishedPosts,
        //         totalArchivedPosts,
        //         totalDraftPosts,
        //         totalComments,
        //         totalApprovedComments,
        //         totalRejectedComments,
        //         totalPostViews
        //     }
        // }

        async(px)=> {
            const [totalPosts,totalPublishedPosts ,totalDraftPosts ,totalArchivedPosts ,totalComments , totalApprovedComments ,totalRejectedComments ,totalPostViewsAggregate ] = await Promise.all([
                await px.post.count(),
                await px.post.count({
                    where : {
                        status : PostStatus.PUBLISHED
                    }
                }),
                await px.post.count({
                    where : {
                        status : PostStatus.DRAFT
                    }
                }),
                await px.post.count({
                    where : {
                        status : PostStatus.ARCHIVED
                    }
                }),

                await px.comment.count(),

                await px.comment.count({
                    where : {
                        status : CommentStatus.APPROVED
                    }
                }),
                await px.comment.count({
                    where : {
                        status : CommentStatus.REJECT
                    }
                }),
                await px.post.aggregate({
                    _sum : {
                        views : true
                    }
                })
            ])
            return {
                totalPosts,
                totalPublishedPosts,
                totalArchivedPosts,
                totalDraftPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews : totalPostViewsAggregate._sum.views
            }
        }
    )

    return transactionResult
}

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

    await prisma.post.delete({
        where : {
            id : postId
        }
    })

    return null;
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