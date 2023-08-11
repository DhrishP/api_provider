import { createCheckoutLink, createCustomer, hasSubscrip } from "@/lib/stripe";
import Link from "next/link";
import React from "react";

const DashboardPage = async () => {
  const cusId = await createCustomer();
  const hasSub = await hasSubscrip();
  if (!cusId || !hasSub) {
    const link = await createCheckoutLink(cusId || "");
    return (
      <>
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Task failed successfully.</span>
        </div>
       <p>Click {<Link href={link || "/dashboard"}>Here </Link>} to start using our API's</p>
      </>
    );
  }
  return (
    <div>
      <div className="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>You are subscribed</span>
      </div>
    </div>
  );
};

export default DashboardPage;
