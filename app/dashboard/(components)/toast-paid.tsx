"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const ToastPaid = () => {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Payment was succesful");
    }
    if (searchParams.get("cancel") === "true") {
     toast.error("Something went wrong");
    }
  },[]);
 return <div></div>
};

export default ToastPaid;
