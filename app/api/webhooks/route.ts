import Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";

import { upsertPrice, deletePrice } from "@/prisma/db/price";
import { upsertProduct, deleteProduct } from "@/prisma/db/product";
import {
  manageSubscriptionStatusChange,
  updateSubscriptionStatusChange,
} from "@/prisma/db/subscription";
import { createPayment } from "@/prisma/db/payment";
import { addCreditToUser } from "@/prisma/db/credit";
import { revalidatePath } from "next/cache";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // # subscription object
  const price = event.data.object as Stripe.Price;
  const product = event.data.object as Stripe.Product;
  console.log("event", event);

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
          console.log("product", product);
          break;

        case "product.updated":
          await upsertProduct(product);
          break;
        case "price.created":
          console.log("price", price);
          break;

        case "price.updated":
          await upsertPrice(price);
          break;
        case "price.deleted":
          await deletePrice(price);
          break;
        case "product.deleted":
          await deleteProduct(product);
          break;

        case "invoice.payment_succeeded":
          // this is when user successfully paid the subscription or renewal them
          // we will add additional credit to them, and make clear any usage for the month
          // update subscription data if needed
          break;
        case "customer.subscription.created":
          let createdSub = event.data.object as Stripe.Subscription;
          console.log("sub created", createdSub);
          await manageSubscriptionStatusChange(
            createdSub.id,
            createdSub.customer as string
          );
          break;
        case "customer.subscription.updated":
          const updatedSub = event.data.object as Stripe.Subscription;
          await updateSubscriptionStatusChange(
            updatedSub.id,
            updatedSub.customer as string
          );
          break;
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string
            );
          }

          if (checkoutSession.mode == "payment") {
            console.log("made new payment");
            console.log("checkoutsession", checkoutSession);

            await createPayment({
              userId: checkoutSession.customer as string,
              sessionId: checkoutSession.id,
            });

            // # get checkout items
            const item = await stripe.checkout.sessions.listLineItems(
              checkoutSession.id
            );

            // # update credit
            await addCreditToUser({
              userId: checkoutSession.customer as string,
              qty: item.data[0].quantity ?? 1,
            });
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        {
          status: 400,
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }

  revalidatePath("/", "layout");

  return new Response(JSON.stringify({ received: true }));
}
