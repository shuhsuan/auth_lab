import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { users } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request){
    try{ 
        const body = await req.json();
        const {email, password} = body;

        const user = users.find((u) => u.email === email);

        if(!user){
            return NextResponse.json(
                {error: "Invalid credentials"},
                {status: 400}
            );
        }

        const validPassword = await bcrypt.compare(
            password, 
            user.passwordHash
        )

        if(!validPassword){
            return NextResponse.json(
                {error: "Invalid credentials"},
                {status: 401}
            );
        }

        const token = jwt.sign(
            {
                userId: user.id,
                name: user.name,
                email: user.email,
            },
            JWT_SECRET,
            {expiresIn: "1h"}
        );
        return NextResponse.json({token});
    }catch{
        return NextResponse.json({error: "Invalid request"}, {status: 400})
    }
}