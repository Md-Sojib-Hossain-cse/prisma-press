import  httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express"
import config from "../config";
import { jwtUtils } from "../utils/jwt";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from '../utils/catchAsync';
import { prisma } from '../lib/prisma';

declare global {
    namespace Express{
        interface Request {
            user ?: {
                id : string;
                name : string;
                email : string;
                role : Role
            }
        }
    }
}

const auth = (...roles : Role[] ) => {
    return catchAsync(async (req :Request , res : Response , next : NextFunction) => {
    const token = req.cookies.accessToken 
        ? req.cookies.accessToken 
        : req.headers.authorization?.startsWith("Bearer") 
            ? req.headers.authorization?.split(" ")[1] 
            : req.headers.authorization;

    if(!token){
         throw new Error("You are not logged in , please logged in to access your resource!")
    }

    const verifyToken = jwtUtils.verifyToken(token , config.jwt_access_secret)

    if(!verifyToken.success){
        throw new Error(verifyToken.data)
    }

    const {email , name , id , role} = verifyToken.data


    if(role.length && !role.includes(role)){
        throw new Error("Forbidden!")
    }

    const isUserExists = await prisma.user.findUnique({
        where : {
            id ,
            email,
            name
        }
    })


    if(!isUserExists){
        throw new Error("User not found!")
    }

    if(isUserExists.activeStatus === "BLOCKED"){
        throw new Error("Your account is blocked , please contact to support.")
    }

    req.user = {
        email , 
        id , 
        name , 
        role
    }

    next()
})
}


export default auth