import prisma from "@/prisma/client";
import { auth, currentUser } from "@clerk/nextjs";
import { randomUUID } from "crypto";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});
export const hasSubscrip = async () => {
  const { userId } = auth();
  const user = await currentUser();
  if (userId && user) {
    const findUser = await prisma.user.findFirst({
      where: {
        authId: userId,
      },
    });
    const subs = await stripe.subscriptions.list({
      customer: String(findUser?.stripe_cust_id),
    });
    if (subs.data.length>0 && !findUser?.api_key && findUser) {
      await prisma.user.update({
        where: {
          email: user.emailAddresses.map((e) => e.emailAddress),
        },
        data: {
          api_key: "secr_" + randomUUID(),
        },
      });
    }
    return subs.data.length > 0;
  }
  return false;
};
export const createCheckoutLink = async (customer: string) => {
  const checkout: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      success_url: `http://localhost:3000/dashboard?success=true`,
      cancel_url: `http://localhost:3000/dashboard?cancel=true`,
      mode: "subscription",
      customer: customer,
      line_items: [
        {
          price: "price_1NdxGySIC4BoERJpj21zN5yA",
        },
      ],
    });
  return checkout.url;
};

export const createCustomer = async () => {
  const { userId } = auth();
  const user = await currentUser();

  if (userId && user) {
    const User = await prisma.user.findFirst({
      where: {
        authId: userId,
      },
    });
    if (!User) {
      const customer = await stripe.customers.create({
        email: String(user.emailAddresses[0].emailAddress),
      });
      await prisma.user.create({
        data: {
          email: user.emailAddresses.map((e) => e.emailAddress),
          authId: userId,
          image: user.imageUrl,
          name: user.firstName?.concat(user.lastName || ""),
          stripe_cust_id: customer.id,
        },
      });
    }
    const findCustId = await prisma.user.findFirst({
      where: {
        authId: userId,
        name: user.firstName?.concat(user.lastName || ""),
      },
    });
    return findCustId?.stripe_cust_id;
  }
  return null;
};
