import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request){
    const authHeader = req.headers.get("authorization");

    if(!authHeader){
        return NextResponse.json(
            {error: "No token provided"},
            {status: 400}
        );
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = verifyToken(token);
        
        return NextResponse.json({
            message: "Protected data",
            user: decoded
        });
    }catch{
        return NextResponse.json(
            {error: "Invalid token"},
            {status: 400}
        )
    }
}