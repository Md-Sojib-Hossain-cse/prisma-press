import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


const registerUser = catchAsync( async(req : Request , res : Response , next : NextFunction) => {
    
        const payload = req.body;

    const user = await userService.registerUserIntoDB(payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "User registered successfully!",
        data : user
    })
})


const getMyProfile = catchAsync( async(req : Request , res : Response , next : NextFunction) =>{
    const {accessToken} = req.cookies;

    const verifyToken = jwtUtils.verifyToken(accessToken , config.jwt_access_secret)

    if(typeof verifyToken === "string"){
        throw new Error(verifyToken)
    }

    const result = await userService.getMyProfileFromDB(verifyToken.id)
    
    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "User logged in successfully!",
        data : result
    })
}) 

export const userController = {
    registerUser,
    getMyProfile
}