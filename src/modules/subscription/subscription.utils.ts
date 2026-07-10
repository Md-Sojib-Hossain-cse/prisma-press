import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

 export const getPeriodEnd = (payload : Stripe.Subscription) => {
    const currentPeriodEndInMS = payload.items.data[0]?.current_period_end;

    const currentPeriodEnd = new Date(Number(currentPeriodEndInMS) * 1000)

    return currentPeriodEnd
 }

export const handledCheckoutCompleted = async(session : Stripe.Checkout.Session) => {
     const userId = session?.metadata?.userId;
            const stripeCustomerId  = session.customer as string;
            const stripeSubscriptionId = session.subscription as string;

            if(!userId || !stripeSubscriptionId || !stripeCustomerId){
                console.log(`webhook : missing values for creating checkout session`)
                return
            }

            const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string)

            const currentPeriodEnd = getPeriodEnd(stripeSubscription)

            await prisma.subscription.upsert({
                where : {
                    userId
                },
                create : {
                    userId ,
                    stripeCustomerId,
                    stripeSubscriptionId,
                    status : "ACTIVE",
                    currentPeriodEnd
                }, 
                update :{
                    stripeCustomerId,
                    stripeSubscriptionId,
                    status : "ACTIVE",
                    currentPeriodEnd
                }
                
            })
 }

export const handleChangeSubscription = async(payload : Stripe.Subscription) => {
    const stripeSubscriptionId = payload.id;
    const subscriptionStatus = (payload.status === "active" || payload.status === "trialing") ? SubscriptionStatus.ACTIVE :payload.status === "canceled" ? SubscriptionStatus.CANCEL : SubscriptionStatus.EXPIRED

    const currentPeriodEnd = getPeriodEnd(payload)

    const isSubscriptionExists = prisma.subscription.findUnique({
        where : {
            stripeSubscriptionId 
        }
    })

    if(!isSubscriptionExists){
        console.log(`webhook : no subscription found for subscription id : ${stripeSubscriptionId}`)
        return 
    }

    await prisma.subscription.update({
        where : {
            stripeSubscriptionId
        },
        data : {
            status : subscriptionStatus,
            currentPeriodEnd
        }
    })
 }