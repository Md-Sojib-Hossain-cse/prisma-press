import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { postService } from "./post.service"
import { sendResponse } from "../../utils/sendResponse"

const getAllPosts = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})

const getSpecificPost = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})

const getMyPosts = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})

const getPostStats = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})

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

const updatePost = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})

const deletePost = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})


export const postController = {
    getAllPosts,
    getSpecificPost,
    getMyPosts,
    getPostStats,
    createPost,
    updatePost,
    deletePost
}