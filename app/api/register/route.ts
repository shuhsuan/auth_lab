import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { users } from "@/lib/db";

export async function POST(req: Request){
    try{
        const body = await req.json();
        const {name, email, password} = body;

        if(!name || !email || !password){
            return NextResponse.json(
                {error: "Name, email, and/or password required"},
                {status: 400}
            );
        }

        const existingUser = users.find((u) => {u.email === email});

        if(existingUser){
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            name,
            email,
            passwordHash,
        };

        users.push(newUser);

        return NextResponse.json(
            {message: "User created"},
            {status: 200}
        );
    }catch{
        return NextResponse.json({error: "Invalid Request"}, {status: 400});
    }
}

