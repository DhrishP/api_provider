import Container from "@/components/ui/container";
import { createCheckoutLink, createCustomer, hasSubscrip } from "@/lib/stripe";
import React from "react";

const DashLayout = async ({ children }: { children: React.ReactNode }) => {

  return <Container>{children}</Container>;
};

export default DashLayout;
