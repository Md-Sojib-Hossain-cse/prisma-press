import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getSpecificAuthorComments = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})
const getSingleComment = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})
const createComment = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})
const updateComment = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})
const deleteComment = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})
const changeCommentModStats = catchAsync(async(req : Request , res : Response, next : NextFunction) => {})


export const commentController = {
    getSpecificAuthorComments,
    getSingleComment,
    createComment,
    updateComment,
    deleteComment,
    changeCommentModStats
}