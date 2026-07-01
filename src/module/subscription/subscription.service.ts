import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckOutSession = async (userId : string) => {
    const checkoutTrasnsaction = await prisma.$transaction(
        async(tx) => {
            const user = await tx.user.findUniqueOrThrow({
                where: {
                    id: userId
                },
                include: {
                    subscriptions: true
                }
            })

            let stripeCustomerId = user.subscriptions?.stripeCustomerId;

            if (!stripeCustomerId) {
                //new customer, create a new stripe customer
                const customer = await stripe.customers.create({
                    email : user.email,
                    name: user.name,
                    metadata: {
                        userId : user.id
                    }
                })

                stripeCustomerId = customer.id
            }

            const session = await stripe.checkout.sessions.create({
                line_items: [{
                    price: config.stripe_product_price_id,
                    quantity: 1
                }],
                mode: "subscription",
                customer : stripeCustomerId,
                payment_method_types: ["card"],
                success_url: `${config.app_url}/premium/success`,
                cancel_url: `${config.app_url}/payment/cancel`,
                metadata: {
                    userId: user.id
                }
            })

            return session.url
        }
        
    )

    return {
        paymentURL : checkoutTrasnsaction
    }
}


export const subscriptionService = {
    createCheckOutSession
}