
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";


export default async function addTodo() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">44444</h1>
                <p>Your protected Todo page content goes here.</p>
            </main>
        </div>
    );
}
