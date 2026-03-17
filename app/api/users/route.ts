import { NextResponse } from "next/server";
import { users } from "@/lib/db";

export async function GET() {
    return NextResponse.json(users);
} //I guess with a db it'd be something like db.query ("select id, name, email from users")


export async function POST(req: Request) {


    try {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and/or email are required" },
                { status: 400 }
            );
        }

        const newUser = {
            id: users.length + 1,
            name,
            email,
            passwordHash: ""
        };

        users.push(newUser);
        return NextResponse.json(newUser, {status: 200})
    }
    catch (erorr) {
        return NextResponse.json(
            { error: "Invalid json" },
            { status: 400 }
        )
    }
}
