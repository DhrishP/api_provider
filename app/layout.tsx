import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { ClerkProvider, auth, currentUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { createCustomer } from "@/lib/stripe";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "800"],
});

export const metadata: Metadata = {
  title: "API_PROVIDER",
  description: "A app to provide api using stripe",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await createCustomer();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={urbanist.className}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
