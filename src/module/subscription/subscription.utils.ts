import { Stripe } from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

const getPeriodEnd = (payload: Stripe.Subscription) => {
  const currentPeriodEndINMiliSecond =
    payload.items.data[0]?.current_period_end!;
  const currentPeriodEnd = new Date(currentPeriodEndINMiliSecond);
  return currentPeriodEnd;
};

export const handleCheckOutComplete = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log("Webhook: Cant get all the required data");
    return
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const currentPeriodEnd = getPeriodEnd(stripeSubscription);

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeSubscriptionId,
      stripeCustomerId,
      currentPeriodEnd,
      status: "ACTIVE",
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd,
      status: "ACTIVE",
    },
  });
};

export const handleChangeSubcription = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;
  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCLED
        : SubscriptionStatus.EXPIRED;

    const currentPeriodEnd = getPeriodEnd(payload);

    const isSubscriptionExists =await prisma.subscription.findUnique({
        where: {
            stripeSubscriptionId
        }
    })

    if (!isSubscriptionExists) {
        console.log(`Subscription is not available with ${stripeSubscriptionId} id`);
        return;
    }

    await prisma.subscription.update({
        where: {
            stripeSubscriptionId
        },
        data: {
            status,
            currentPeriodEnd
        }
    })

};