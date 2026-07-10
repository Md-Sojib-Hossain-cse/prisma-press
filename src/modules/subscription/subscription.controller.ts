import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createCheckoutSession = catchAsync( async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionService.createCheckoutSession(userId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Checkout completed successfully!",
        data : result
    })
})


const handleWebhook = catchAsync(async (request :Request , response : Response , next : NextFunction) => {
    const event = request.body as Buffer;
    const signature = request.headers['stripe-signature']!;

    await subscriptionService.handleWebhook(event , signature as string);

    sendResponse(response , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Webhook triggered successfully!",
        data : null
    })
})

export const subscriptionController = {
    createCheckoutSession,
    handleWebhook
}