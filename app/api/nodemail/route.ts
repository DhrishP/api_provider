import Content from "@/lib/content";
import { mailOptions, transporter } from "@/lib/transporter";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




export async function POST(req:Request){
    const {userId} =  auth()
    const content = Content()
    const {email,pass} =await req.json()
    if(!userId) return NextResponse.json("Not authorized",{status:401})
    if(!email || !pass) return NextResponse.json("No credentials were found",{status:400})
    try {
        await transporter.sendMail({
            ...mailOptions,
            text:"Something went wrong",
            html:content,
            subject:"Stripe confirmation"
        })
        return NextResponse.json("",{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"bad request"},{status:400})
    }
}