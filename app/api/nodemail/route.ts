

import StripeWelcomeEmail from "@/lib/email";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(req:Request){
    const resend =new Resend(process.env.RESEND_SECRET as string)
    const {userId} =  auth()
    if(!userId) return NextResponse.json("Not authorized",{status:401})
    try {
       const data = await resend.emails.create({
        from:"trexturbo55@gmail.com",
        to:"dhrishparekh.ss@gmail.com",
        subject:"Timepass",
        react:StripeWelcomeEmail()
       })
        return NextResponse.json(data,{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"bad request"},{status:400})
    }
}