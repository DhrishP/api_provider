import {
  createCheckoutLink,
  createCustomer,
  hasSubscrip,
  stripe,
} from "@/lib/stripe";
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import HandleCopy from "./(components)/handle-copy";
import Link from "next/link";
import React from "react";
import ToastPaid from "./(components)/toast-paid";
import Currency from "@/lib/currency-con";

const DashboardPage = async () => {
  const cusId = await createCustomer();
  const hasSub = await hasSubscrip();
  const { userId } = auth();
  const log = await prisma.log.findMany({
    where: {
      userId: userId as string,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
  const user = await prisma.user.findFirst({
    where: {
      stripe_cust_id: cusId,
    },
  });

  if (!cusId || !hasSub) {
    const link = await createCheckoutLink(cusId || "");

    return (
      <>
         <ToastPaid />
        <div
          className="p-4 mt-10 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">No subscription!</span> Click{" "}
          {
            <Link
              className="font-bold text-md underline "
              href={link || "/dashboard"}
            >
              Here{" "}
            </Link>
          }{" "}
          to buy one to get access to our API keys
        </div>
      </>
    );
  }
  const subscriptions = await stripe.subscriptions.list({
    customer: String(user?.stripe_cust_id),
  });
  const invoice = await stripe.invoices.retrieveUpcoming({
    subscription: subscriptions.data.at(0)?.id,
  });
  const current_usage = invoice.amount_due;

  return (
    <div className="space-y-8 ">
      <ToastPaid />
      <div
        className="p-4 mt-10 mb-4 text-sm text-green-800 rounded-lg bg-green-400 dark:bg-gray-800 dark:text-green-500"
        role="alert"
      >
        <span className="font-bold">You have a subscription!</span> These are
        the API keys you have access to
      </div>
      <div>
        <div className="flex justify-center">
          <div className="w-3/4 p-4 border">Price and Usage</div>
        </div>
        <div className="flex justify-center">
          <div className="w-3/4 p-4 border font-mono flex justify-between mx-3  ">
            <Currency value={(current_usage / 2000) * 20} />
            <div>Current Usage : ({current_usage / 2000})</div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <div className="w-3/4 p-4 border">Api key</div>
        </div>
        <div className="flex justify-center">
          <div className="w-3/4 p-4 border font-mono flex justify-between ">
            <span>{user?.api_key}</span>
            <HandleCopy api_key={user?.api_key} />
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <div className="w-3/4 p-4 border">Log Events</div>
        </div>
        <div className="flex  flex-col items-center justify-center">
          {log.map((log) => (
            <div
              key={log.id}
              className="w-3/4 p-4 border font-medium flex justify-between mx-2"
            >
              <span className="flex space-x-10">
                <h4>{log.method}</h4>
                <span>{log.status}</span>
              </span>
              <span>{log.createdAt.toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
