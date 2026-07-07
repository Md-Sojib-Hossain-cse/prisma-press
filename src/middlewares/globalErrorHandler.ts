import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client"

export const globalErrorHandler = (err : any , req : Request , res : Response , next : NextFunction) => {
    console.log("Error" , err)

    let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
    let message : string = err.message || "Something went wrong!";
    let errorName : string = err.name || "Internal Server Error!";

    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = httpStatus.BAD_REQUEST
        message = "You have provided a incorrect type or incorrect field."
    } else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === "P2002"){
            statusCode = httpStatus.BAD_REQUEST
            message = "Duplicate key error!"
        } else if (err.code = "P2003"){
            statusCode = httpStatus.BAD_REQUEST
            message = "Foreign key constraint failed!"
        }else if (err.code = "P2025"){
            statusCode = httpStatus.BAD_REQUEST
            message = "An operation failed because it depends on one or more records that were required but not found. {cause}"
        }
    }
    else if(err instanceof Prisma.PrismaClientInitializationError){
        if(err.errorCode === "P1000"){
        statusCode = httpStatus.UNAUTHORIZED
        message = "Authentication failed against database server , please check your credentials!"
    } else if(err.errorCode === "P1001"){
        statusCode = httpStatus.BAD_REQUEST
        message = "Can't reach database server!"
    }
    }else if (err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = "Error occurred during query execution!"
    }




        res.status(statusCode).json({
            success : false,
            statusCode,
            message : message || "Something went wrong!",
            name : errorName,
            error : err.stack
        })
}