import Stripe from "stripe"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { handleChangeSubscription, handledCheckoutCompleted } from "./subscription.utils"

const createCheckoutSession = async (userId : string) => {
    const transactionResult = await prisma.$transaction(async(tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where : {
                id : userId
            },
            include : {
                subscriptions : true
            },
            omit : {
                password : true
            }
        })

        //old subscriber
        let stripeCustomerId = user.subscriptions?.stripeCustomerId;

        if(!stripeCustomerId){
            //new subscriber
            const customer = await stripe.customers.create({
            email : user.email,
            name : user.name,
            metadata : {
                userId : user.id
            }
            })
        stripeCustomerId = customer.id
        }

        const session = await stripe.checkout.sessions.create({
            line_items : [{
                price : config.stripe_product_price_id,
                quantity : 1
            }],
            mode : "subscription",
            customer : stripeCustomerId,
            payment_method_types : ["card"],
            success_url : `${config.app_url}/premium?success=true`,
            cancel_url :`${config.app_url}/payment?success=false`,
            metadata : {
                userId : user.id
            }
        })

        return session.url
    })

    return {
        paymentUrl : transactionResult
    }
}


const handleWebhook = async (payload : Buffer , signature : string) => {
    const endpointSecret = config.stripe_webhook_secret
    const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            endpointSecret
        );

    switch (event.type) {
        case 'checkout.session.completed':
            //Occurs when a Checkout Session has been successfully completed.
            const session : Stripe.Checkout.Session =  event.data.object

            handledCheckoutCompleted(session)
           
        break;
        case 'customer.subscription.updated':
            //Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
            handleChangeSubscription(event.data.object)
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
        break;
        case 'customer.subscription.deleted':
            //Occurs whenever a customer’s subscription ends.
            handleChangeSubscription(event.data.object)
        break;
        default:
            // Unexpected event type
            console.log(`No event matched ,Unhandled event type ${event.type}.`);
        break;
  }
 }


export const subscriptionService = {
    createCheckoutSession,
    handleWebhook
}