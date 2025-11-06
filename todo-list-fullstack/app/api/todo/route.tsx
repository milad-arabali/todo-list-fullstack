import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/users";

async function ensureDbConnection() {
    try {
        await connectDb();
    } catch (err) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const dbError = await ensureDbConnection();
    if (dbError) return dbError;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
        { message: "GET request successful", todos: user.todos },
        { status: 200 }
    );
}

export async function POST(req: Request) {
    const dbError = await ensureDbConnection();
    if (dbError) return dbError;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, status } = body;
    if (!title || !status) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isDuplicate = user.todos.some(
        (todo: { title: string; status: string }) =>
            todo.title.trim().toLowerCase() === title.trim().toLowerCase() &&
            todo.status === status
    );
    if (isDuplicate) {
        return NextResponse.json({ error: "Todo already exists" }, { status: 409 });
    }

    user.todos.push({ title, status });
    await user.save();

    return NextResponse.json({ message: "Todo added successfully" }, { status: 201 });
}
