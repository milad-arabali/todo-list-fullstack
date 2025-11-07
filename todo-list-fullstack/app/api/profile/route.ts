import {NextResponse} from "next/server";
import connectDb from "@/utils/connectDb";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/users";
import {hashPassword} from "@/utils/auth";

async function ensureDbConnection() {
    try {
        await connectDb();
        return null;
    } catch (err) {
        return NextResponse.json({error: "Database connection failed"}, {status: 500});
    }
}


export async function GET() {
    const dbError = await ensureDbConnection();
    if (dbError) return dbError;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
        return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const user = await User.findOne({email: session.user.email}).select("-password -__v").lean();

    if (!user) return NextResponse.json({error: "User not found"}, {status: 404});

    return NextResponse.json({success: true, user}, {status: 200});
}

export async function PATCH(req: Request) {
    const dbError = await ensureDbConnection();
    if (dbError) return dbError;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    const body = await req.json();
    const allowed = ["name", "family"];
    const update: Record<string, any> = {};

    for (const key of allowed) {
        if (body[key] !== undefined) update[key] = body[key];
    }

    if (body.password && body.password.trim() !== "") {
        update.password = await hashPassword(body.password);
    }

    if (Object.keys(update).length === 0)
        return NextResponse.json({error: "No valid fields to update"}, {status: 400});

    const updated = await User.findOneAndUpdate(
        {email: session.user.email},
        {$set: update},
        {new: true, select: "-password -__v"}
    );

    if (!updated) return NextResponse.json({error: "User not found"}, {status: 404});

    return NextResponse.json({success: true, user: updated}, {status: 200});
}
