import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { premiumService } from "./premium.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const getPremiumContent = (catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;

    const result = await premiumService.getPremiumContent()

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Premium content retrieve successfully!",
        data : result
    })
}))


export const premiumController = {
    getPremiumContent
}