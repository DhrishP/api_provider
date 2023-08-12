import { stripe } from "@/lib/stripe";
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = auth();
  const { searchParams } = new URL(req.url);
  const api = searchParams.get("api_key");
  if (!api)
    return NextResponse.json({ error: "api key missing" }, { status: 403 });
  if (api.length > 1) {
    const checkUser = await prisma.user.findFirst({
      where: {
        api_key: String(api),
      },
    });
    if (!checkUser)
      return NextResponse.json({ error: "wrong api key" }, { status: 401 });
    const subs = await stripe.subscriptions.list({
      customer: String(checkUser?.stripe_cust_id),
    });
    const item = subs.data.at(0)?.items.data.at(0);
    if (!item) return NextResponse.json({ error: "no subscription currently" });
    const result = await stripe.subscriptionItems.createUsageRecord(
      String(item.id),
      {
        quantity: 1,
      }
    );

    await prisma.log.create({
      data: {
        userId: String(userId),
        method: "GET",
        status: 200,
      },
    });
  }

  return NextResponse.json({
    status: true,
    key: randomUUID(),
  });
}
