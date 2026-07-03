import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { postService } from "./post.service"
import { sendResponse } from "../../utils/sendResponse"

const getAllPosts = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const result = await postService.getAllPostsFromDB()

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "All post fetched successfully!",
        data : result
    })
})

const getSpecificPost = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const postId = req.params.postId;

    if(!postId){
        throw new Error("Post id required in params.")
    }

    const result = await postService.getSpecificPostFromDB(postId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Post fetched successfully!",
        data : result
    })
})

const getMyPosts = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const authorId = req.user?.id;

    const result = await postService.getMyPostsFromDB(authorId as string);

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "My posts fetched successfully!",
        data : result
    })
})

const getPostStats = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const result = await postService.getPostStatsFromDB();

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Post stats retrieved successfully!",
        data : result
    })
})

const createPost = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await postService.createPostOnDB(userId as string, payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Post created successfully!",
        data : result
    })
})

const updatePost = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;
    const payload = req.body;

     if(!postId){
        throw new Error("Post id required in params.")
    }

    const result = await postService.updatePostOnDB(postId as string , payload , userId as string , isAdmin)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Post updated successfully!",
        data : result
    })
})

const deletePost = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;

     if(!postId){
        throw new Error("Post id required in params.")
    }

    const result = await postService.deletePostFromDB(postId as string , userId as string , isAdmin)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Post deleted successfully!",
        data : result
    })
})


export const postController = {
    getAllPosts,
    getSpecificPost,
    getMyPosts,
    getPostStats,
    createPost,
    updatePost,
    deletePost
}