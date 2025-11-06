import {NextResponse} from "next/server";
import connectDb from "@/utils/connectDb";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/users";
import sortTodo from "@/utils/sort-todo";


type Todo = {
    title: string;
    status: string;
    [key: string]: any;
};


type UserLean = {
    email: string;
    todos?: Todo[];
};


async function ensureDbConnection() {
    try {
        await connectDb();
        return null;
    } catch (err) {
        return NextResponse.json({error: "Database connection failed"}, {status: 500});
    }
}

export async function POST(req: Request) {
    const dbError = await ensureDbConnection();
    if (dbError) return dbError;

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const body = await req.json();
        const {title, status} = body;

        if (!title || !status) {
            return NextResponse.json(
                {error: "All fields are required"},
                {status: 400}
            );
        }

        const user = await User.findOne({email: session.user.email});
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        const isDuplicate = user.todos.some(
            (todo: { title: string; status: string }) =>
                todo.title.trim().toLowerCase() === title.trim().toLowerCase() &&
                todo.status === status
        );
        if (isDuplicate) {
            return NextResponse.json(
                {error: "Todo already exists"},
                {status: 409}
            );
        }

        user.todos.push({title, status});
        await user.save();
        return NextResponse.json(
            {
                success: true,
                message: "Todo added successfully",

            },
            {status: 201}
        );
    } catch (error: any) {
        console.error("POST /todo error:", error);
        return NextResponse.json(
            {error: error.message || "Internal Server Error"},
            {status: 500}
        );
    }
}

export async function GET(req: Request) {

    const dbError = await ensureDbConnection();
    if (dbError) return dbError;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        const user = await User.findOne({email: session.user.email})
            .select("todos email")
            .lean<UserLean>();

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const sortedTodos = sortTodo(user.todos ?? []);
        return NextResponse.json(
            {
                success: true,
                message: "Todos fetched successfully",
                todos: sortedTodos,
            },
            {status: 200}
        );
    } catch (error: any) {
        console.error("GET /todo error:", error);
        return NextResponse.json(
            {error: error.message || "Internal Server Error"},
            {status: 500}
        );
    }
}
