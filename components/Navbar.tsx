import React from "react";
import { UserButton } from "@clerk/nextjs";
import Container from "./ui/container";
import Link from "next/link";

const Navbar = () => {
  return (
    <Container>
      <nav className="flex justify-between mx-auto mt-3 items-center ">
        <div>
          <h1 className="font-bold text-md ml-2">LOGO</h1>
        </div>
        <div>
          {" "}
          <div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        <div>
          <ul className="flex items-center space-x-4 mr-2">
            <Link href={"/features"}>form</Link>
            <Link href={"/dashboard"}>Pricing</Link>
            <li className="cursor-pointer">
              <Link
                href={"/dashboard"}
                className="bg-slate-900 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 py-2 px-2"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </Container>
  );
};

export default Navbar;
