import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const getSpecificAuthorComments = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const authorId = req.params.authorId;
    const result = await commentService.getSpecificAuthorCommentsFromDB(authorId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Comments retrieve successfully!",
        data : result
    })
})
const getCommentByPostId = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const postId = req.params.postId;

    const result = await commentService.getCommentsByPostIdFromDB(postId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Comment retrieve successfully!",
        data : result
    })
})
const createComment = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const userId = req?.user?.id;
    const payload = req.body;

    const result = await commentService.createCommentOnDB(userId as string, payload);

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Comment created successfully!",
        data : result
    })
})
const updateComment = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const userId = req.user?.id;
    const commentId = req.params.commentId;
    const payload = req.body;

    const result = await commentService.updateCommentOnDB(userId as string, commentId as string, payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Comment created successfully!",
        data : result
    })
})
const deleteComment = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const userId = req.user?.id;
    const commentId = req.params.commentId;

    const result = await commentService.deleteCommentFromDB(userId as string,commentId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Comment deleted successfully!",
        data : result
    })
})
const changeCommentModStats = catchAsync(async(req : Request , res : Response, next : NextFunction) => {
    const commentId = req.params.commentId;
    const payload = req.body;
    const result = await commentService.changeCommentModStatsOnDB(commentId as string , payload.status)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Comment updated successfully!",
        data : result
    })
})


export const commentController = {
    getSpecificAuthorComments,
    getCommentByPostId,
    createComment,
    updateComment,
    deleteComment,
    changeCommentModStats
}