import {NextResponse} from "next/server";
import connectDb from "@/utils/connectDb";
import User from "@/models/users";
import {hashPassword} from "@/utils/auth";

export async function POST(req: Request) {
    try {
        const {name, family, email, password} = await req.json();

        if (!name || !family || !email || !password) {
            return NextResponse.json({error: "All fields are required"}, {status: 400});
        }

        await connectDb();

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json({error: "This email is already registered"}, {status: 400});
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            name,
            family,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            {message: "Registration completed successfully", user: {name: newUser.name, email: newUser.email}},
            {status: 201}
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({error: "An error occurred"}, {status: 500});

    }
}
