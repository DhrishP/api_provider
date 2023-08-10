import prisma from "@/prisma/client";
import { auth, currentUser } from "@clerk/nextjs";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

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
  }
};
